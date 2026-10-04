from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
root=Path(__file__).resolve().parents[1]/'fixtures'
(root/'numbered').mkdir(parents=True,exist_ok=True)
(root/'validation').mkdir(exist_ok=True)
for i, number in enumerate([1,2,3,10]):
    image=Image.new('RGBA',(256,256))
    shadow=Image.new('RGBA',image.size); d=ImageDraw.Draw(shadow)
    d.rounded_rectangle((70,60-i*8,186,224),18,fill=(126,232,140,180));shadow=shadow.filter(ImageFilter.GaussianBlur(3));image.alpha_composite(shadow)
    d=ImageDraw.Draw(image);d.rounded_rectangle((70,60-i*8,186,224),18,fill=(126,232,140,255))
    d.rectangle((50,95+i*8,69,124+i*8),fill=(245,113,74,255));d.rectangle((187,95-i*8,206,124-i*8),fill=(74,147,245,255))
    d.text((113,124),str(i),fill=(20,40,28,255),font_size=56)
    d.line((110,224,146,224),fill='white',width=3);d.line((128,206,128,240),fill='white',width=3)
    image.save(root/'numbered'/f'frame_{number}.png')
Image.new('RGBA',(64,48),(0,0,0,0)).save(root/'validation'/'empty_4.png')
Image.new('RGB',(64,48),(240,100,70)).save(root/'validation'/'opaque_5.png')
(root/'validation'/'broken_6.png').write_bytes(b'not a PNG')
(root/'validation'/'unsupported.txt').write_text('Not an image')
print('Created 4 numbered PNGs and validation fixtures.')
