# check, if theme width/hight and values of the scale-9-rectangles match up.
import argparse
import os
import json

THEME_SCALE = 2
THEME_ASSETS = '../assets/'

mappings = {
    'BUTTON_SCALE_9_GRID': ['button-hover-skin0000', 'button-up-skin0000', "button-disabled-skin0000"]
}


def check(theme_assets):
    themes = os.listdir(theme_assets)
    for theme in themes:
        scale_9_file = os.path.join(theme_assets, theme, theme+'_scale_9.json')
        if not os.path.exists(scale_9_file):
            print('scale 9 file not found for theme "{}"'.format(theme))
            continue
            
        texture_file = os.path.join(theme_assets, theme, theme+'.json')
        if not os.path.exists(texture_file):
            print('json texture file not found for theme "{}"'.format(theme))
            continue
        
        print('testing theme {}...'.format(theme))
        scale_9_grid = json.load(file(scale_9_file, 'r'))
        textures = json.load(file(texture_file, 'r'))
        for grid_name, grid in scale_9_grid.items():
            if not grid_name in mappings:
                continue
                
            # TODO: we assume the default scale of 2
            grid = [int(g)*2 for g in grid]
            calc_width = grid[0] * 2 + grid[2]
            calc_height = grid[1] * 2 + grid[3]
            
            for texture_name in mappings[grid_name]:
                data = textures['frames'][texture_name]['sourceSize']
                if data['w'] != calc_width:
                    print('WARNING! width for texture {} does not match '+
                          'grid of {} ({} != {})'.format(
                            texture_name, grid_name, data['w'], calc_width))
                if data['h'] != calc_height:
                    print('WARNING! height for texture {} does not match' +
                          'grid of {} ({} != {})'.format(
                            texture_name, grid_name, data['h'], calc_height))
                


def main():
    parser = argparse.ArgumentParser(
        description='check, if theme width/hight and values of the ' +
                    'scale-9-rectangles match up.')
    parser.add_argument('theme_assets', type=str,
                        help='assets folder', nargs='?', default=THEME_ASSETS)
    args = parser.parse_args()
    check(args.theme_assets)



if __name__ == '__main__':
    main()

