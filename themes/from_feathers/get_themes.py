import os
import shutil
import argparse
import parse_feathers_theme
import xml_to_json
import json

# themes folder inside feathers folder
FEATHERS_THEMES = 'themes'


def get_base_file(theme_path):
    # find Base<name>.as-Files to extract scale_9_grid values
    as_path = os.path.join(theme_path,
                           'source', 'feathers', 'themes')
    if not os.path.isdir(as_path):
        return
    for filename in os.listdir(as_path):
        if filename.startswith('Base'):
            base_path = os.path.join(as_path, filename)

            return base_path


def get_texture_name(theme_path):
    # get texture atlas name
    assets_path = os.path.join(theme_path, 'assets', 'images')
    image_files = os.listdir(assets_path)
    texture_files = set([os.path.splitext(f)[0] for f in image_files])
    for texture in texture_files:
        texture_file = os.path.join(assets_path, texture)
        if os.path.exists(texture_file+'.png') and \
            os.path.exists(texture_file+'.xml'):
            return texture_file.split(os.path.sep)[-1]


def get_feathers_themes(feathers_themes_path):
    theme_data = {}
    themes = os.listdir(feathers_themes_path)

    # find Base<name>.as-Files to extract scale_9_grid values
    for theme in themes:
        theme_path = os.path.join(feathers_themes_path, theme)

        if not os.path.isdir(theme_path):
            # not even a directory, no warning printed
            continue

        base_path = get_base_file(theme_path)
        if not base_path:
            print('skipping "{}", no Base*.as file found.'.format(theme))
            continue

        texture_name = get_texture_name(theme_path)
        if not texture_name:
            print('skipping "{}", PNG/XML asset file(s) found.'.format(theme))
            continue

        theme_data[texture_name] = {
            'theme_path': theme_path,
            'base_file': base_path,
            'texture_name': texture_name,
            'theme_texture': os.path.join(theme_path, 'assets', 'images', texture_name)
        }
        print('found feathers theme: {} ({})'.format(theme, texture_name))

    return theme_data


def create_theme_dir(assets_path, name):
    gown_asset = os.path.join(assets_path, name)+os.path.sep
    if not os.path.exists(gown_asset):
        os.makedirs(gown_asset)
    return gown_asset


def process_assets(assets_path, name, theme_path):
    gown_asset = create_theme_dir(assets_path, name)
    # copy assets from feathers and convert .xml to .json
    theme_texture = os.path.join(theme_path, 'assets', 'images', name)
    create_theme_dir(assets_path, name)
    if os.path.exists(theme_texture+'.png'):
        shutil.copy2(theme_texture+'.png', gown_asset)


def get_theme_data(data_path):
    data = {}
    for name in os.listdir(data_path):
        name, ending = os.path.splitext(name)
        if ending != '.json':
            continue
        print('found theme data: {}'.format(name))
        data.setdefault(name, {})
        data[name]['data_path'] = os.path.join(data_path, name+'.json') #json.load(file(path, 'r'))
    return data


def main():
    parser = argparse.ArgumentParser(
        description='Convert theme from feathers for gown.js.')
    parser.add_argument('feathers_path', type=str,
                        help='path to feathers directory')
    parser.add_argument('assets_path', type=str,
                        help='Path to GOWN assets where we extract the theme to')
    parser.add_argument('data_path', type=str,
                        help='Path to manual theme data that will be merged with texture data')
    args = parser.parse_args()
    theme_data = get_theme_data(args.data_path)

    feathers_data = get_feathers_themes(os.path.join(args.feathers_path, FEATHERS_THEMES))
    for name, theme in feathers_data.items():
        theme_data.setdefault(name, {})
        theme_data[name].update(theme)

    for name, theme in theme_data.items():
        data = {}

        # get texture positions and sizes from atlas file
        if 'theme_texture' in theme:
            data.update(xml_to_json.get_data(theme['theme_texture']+'.xml'))

        # get scale 9 values from Base*.as file
        if 'base_file' in theme:
            grids = parse_feathers_theme.get_scale_9_grids(theme['base_file'])
            if grids:
                data['grids'] = grids

        # manual entered data (as last step so the user can overwrite everything)
        if 'data_path' in theme:
            with open(theme['data_path'], 'r') as f:
                data.update(json.load(f))

        # now that we have the data we just need to store everything in
        # the assets-folder and copy the image
        create_theme_dir(args.assets_path, name)
        if 'theme_path' in theme:
            process_assets(args.assets_path, name, theme['theme_path'])

        json_path = os.path.join(args.assets_path, name, name+'.json')
        with open(json_path, 'w') as f:
            json.dump(data, f, indent=2, sort_keys=True)


if __name__ == '__main__':
    main()
