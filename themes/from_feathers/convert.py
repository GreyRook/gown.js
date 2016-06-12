import os
import shutil
import argparse
import parse_feathers_theme
import xml_to_json

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
            return texture_file.split('/')[-1]


def get_themes(feathers_themes_path):
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
            'texture_name': texture_name
        }
        print('found theme: {} ({})'.format(theme, texture_name))
        
    return theme_data


def process_assets(assets_path, name, theme_path):
    # copy assets from feathers and convert .xml to .json
    theme_texture = os.path.join(theme_path, 'assets', 'images', name)
    gown_asset = os.path.join(assets_path, name)+os.path.sep
    if not os.path.exists(gown_asset):
        os.makedirs(gown_asset)
    shutil.copy2(theme_texture+'.png', gown_asset)
    shutil.copy2(theme_texture+'.xml', gown_asset)

    xml_to_json.convert(os.path.join(gown_asset, name+'.xml'))

def main():
    parser = argparse.ArgumentParser(
        description='Convert theme from feathers for gown.js.')
    parser.add_argument('feathers_path', type=str,
                        help='path to feathers directory')
    parser.add_argument('assets_path', type=str,
                        help='Path to GOWN assets where we extract the theme to')
    args = parser.parse_args()
    theme_data = get_themes(os.path.join(args.feathers_path, FEATHERS_THEMES))
    
    for name, theme in theme_data.items():
        # copy asset files to new folder
        process_assets(args.assets_path, name, theme['theme_path'])
        
        # get scale 9 values from Base*.as file
        parse_feathers_theme.convert(theme['base_file'], 
                os.path.join(args.assets_path, name, name))
        


if __name__ == '__main__':
    main()


