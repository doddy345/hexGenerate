To Split a collage:
```
convert root_grid.png -crop 32x32 +repage +adjoin root_%d.png
```

To Run:
```
npm run build && node ./dist/index.js
```

To Combine output:
```
montage -alpha on -background '#00000000' -geometry +0+0 src/outputs/output_??.png spritesheet.png
```

