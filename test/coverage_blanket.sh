browserify index.js > gen/test.gown.js
# add to themes to file (just embeding them into the testrunner does not work)
cat ./src/TestTheme.js >> gen/test.gown.js
cat ../themes/ShapeTheme.js >> gen/test.gown.js
cat ../themes/AeonTheme.js >> gen/test.gown.js

# start web server to provide files using XHR
cd ../
echo http://127.0.0.1:9000/test/testrunner.html
python -m SimpleHTTPServer 9000
