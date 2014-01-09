BUILD_FILE = ../kage.js

all:
	echo > $(BUILD_FILE); \
	cat license.js > $(BUILD_FILE); \
	echo "define(['libs/jquery', 'config/application'], function () { \n\n" >> $(BUILD_FILE); \
	cat base.js class.js util.js component.js model.js view.js section.js module_export.js >> $(BUILD_FILE); \
	echo "});\n" >> $(BUILD_FILE);
