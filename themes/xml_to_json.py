import os
import xml.etree.ElementTree as ET
import json
import argparse
from PIL import Image


def sprite_data(attrib):
    return {
        "frame": {
            "x": int(attrib['x']),
            "y": int(attrib['y']),
            "w": int(attrib['width']),
            "h": int(attrib['height'])
        },
        "rotated": False,
        "trimmed": False,
        "spriteSourceSize": {
            "x": 0,
            "y": 0,
            "w": int(attrib['width']),
            "h": int(attrib['height'])
        },
        "sourceSize": {
            "w": int(attrib['width']),
            "h": int(attrib['height'])
        }
    }


def parse_xml(filename):
    tree = ET.parse(filename)
    root = tree.getroot()
    data = {}
    for child in root:
        data[child.attrib['name']] = sprite_data(child.attrib)
    return root, data


def image_meta(filename):
    im = Image.open(filename)
    return {
        "version": "1.0",
        "image": os.path.split(filename)[1],
        "size": {
            "w": im.size[0],
            "h": im.size[1]
        }
    }


def convert(path):
    base_path = os.path.split(path)[0]
    root, frames = parse_xml(path)
    meta = image_meta(os.path.join(base_path, root.attrib['imagePath']))
    data = {"frames": frames, "meta": meta}
    json_file = file(os.path.splitext(path)[0] + '.json', 'w')
    json.dump(data, json_file, indent=2)


def main():
    parser = argparse.ArgumentParser(
        description='Convert XML theme from feathers to XML for gown.js.')
    parser.add_argument('path', type=str,
                        help='path to xml file')
    args = parser.parse_args()
    convert(args.path)


if __name__ == '__main__':
    main()
