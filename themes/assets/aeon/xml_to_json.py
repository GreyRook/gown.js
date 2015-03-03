import os
import xml.etree.ElementTree as ET
import json
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
        "image": filename,
        "size": {
            "w": im.size[0],
            "h": im.size[1]
        }
    }


def main():
    filename = 'aeon_desktop.xml'
    root, frames = parse_xml(filename)
    meta = image_meta(root.attrib['imagePath'])
    data = {"frames": frames, "meta": meta}
    json_file = file(os.path.splitext(filename)[0] + '.json', 'w')
    json.dump(data, json_file, indent=2)


if __name__ == '__main__':
    main()
