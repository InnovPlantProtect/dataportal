# ckanext-inppschema

This is a CKAN plugin to implement additional metadata fields (schema) specifically for INPP.

It displays the fields for entering metadata on the dataset create/update page and displays the (non-empty) fields on the dataset display page. Some of the INPP fields re-use existing CKAN metadata fields (eg. Description which is renamed to Abstract, Tags which is renamed to Keywords, Topic Category becomes a CKAN group which is displayed as Theme) and the rest are additional.

One unique feature is that the bounding box which the user enters into the four fields (east, west, north, south) is converted into a GeoJSON format and stored in the CKAN extra 'spatial' field which allows the user to search for datasets by specifying an area on a map.
The Spatial Reference System is used to determine whether the coordinates are lat,long degrees or metres in a UTM projection.
At the moment only certain SRS are supported:
* "WGS84", (becomes epsg:4326)
* "Portugal TM06 ETRS89" (becomes epsg:3763)
* "World Pseudo-Mercator WGS84 Datum" (becomes epsg:3857)

There is a mapping between the metadata field called 'topic_category' and the CKAN concept of Groups.
Groups are used to group together all datasets which share a common theme, eg. Biota, and so is synonymous with topic category.
(However, normally, ckan datasets can be a member of multiple groups but INPP topic category is only a single selection).
The schema plugin uses the INPP extra metadata field 'topic_category' to force the dataset to be a member of the corresponding ckan group automatically. The groups must already exist! (see Installation and tools directory).
If the user manually adds a dataset to multiple other groups this will be allowed but if the dataset metadata is subsequently updated then the group membership will be reset to the topic_category group only.

The schema plugin has the ability to restrict download access for the resources of a dataset to members of an organisation or specific named users.
Note that the list of users must be comma-separated without any spaces.
This feature has a dependency on the 'restricted' plugin (see below for installation).


## Installation

First activate your virtual environment, then:
```
pip install pyproj
cd /usr/lib/ckan/default/src
git clone https://github.com/InnovPlantProtect/dataportal/ckanext-inppschema.git
cd ckanext-inppschema
python setup.py develop
```
then add `inppschema` to the `ckan.plugins` line in your ckan config file and restart the web server with `sudo service nginx restart` and `sudo supervisorctl restart ckan-uwsgi:*`  

Now the `restricted` extension needs to be installed:
```
cd /usr/lib/ckan/default/src
git clone https://github.com/InnovPlantProtect/dataportal/ckanext-restricted.git  
cd ckanext-restricted
python setup.py develop
pip install -r dev-requirements.txt
```
then add `restricted` to the `ckan.plugins` line in your ckan config file and restart the web server with `sudo service nginx restart` and `sudo supervisorctl restart ckan-uwsgi:*`  

If you get an Internal Server Error after restarting the web server then check the error log and it might show an IOError Permission Denied trying to update a translation file, eg. `fr.js`. If so, use `sudo chmod 666 filename` where the filename is the full path name shown in the error log such as `/usr/lib/ckan/default/src/ckan/ckan/public/base/i18n/fr.js`

See the CKAN documentation for installing the `spatial` plugins.

## Configuration

See ckanext/inppschema/README.md for more details.

The `restricted` plugin needs to be able to send emails so please make sure you have configured CKAN appropriately, see
https://docs.ckan.org/en/2.9/maintaining/configuration.html?#email-settings

## Troubleshooting

To run a testing version of the web server use `ckan -c /etc/ckan/default/ckan.ini run` then the error messages will appear on screen.

If using apache (ckan 2.8) the log file is `/var/log/apache2/ckan_default.error.log`. The web server can be restarted with `sudo service apache2 restart`

If using nginx (ckan 2.9) the log file is in `/var/log`.  The web server can be restarted with `sudo service nginx restart`

## Updating

Update your local copy of the schema extention using:
```
cd /usr/lib/ckan/default/src/ckanext-inppschema
git pull
sudo service apache2 restart
```

In the unlikely event that the restricted plugin has been updated then you can update your local copy:
```
cd /usr/lib/ckan/default/src/ckanext-restricted
git pull
sudo service apache2 restart
```

## Customising the schema

Warning: do not modify the schema itself once you have started populating the database. It might work but it might not.

The set of additional fields (i.e. additional to those which CKAN already provides such as Description/Abstract) is listed in the file `ckanext/inppschema/metadata_form_fields.txt` (note: tab separated). The fields will be displayed on the CKAN dataset page in the same order as given in this file.  Each field has a title and a helpful description. Most of the fields are implemented as free-form text entry (i.e. not validated or constrained) but some are implemented as drop-down menus. These menus have values as given in the other txt files in the `ckanext/inppschema` directory. If you edit any of these files you need to re-run the `ckanext/inppschema/metadata_form_to_ckan.sh` script. It is the script which determines which fields are implemented as menus. If you no longer want a menu, or you want to change a field from a plain text entry into a menu, then the script will have to be edited.

*Important note* about the schema. It is usually very important that consistent entries are made into the database for similar/identical items. For example if a dataset is in English then the database should record English, not Inglish, Anglais or anything else, even though they all mean "English". For this reason a drop-down menu is helpful to constrain the entry. The menu description files have the database key and the human-readable description together for each item. Once you have started populating the database do not change the database keys. For example the country code for South Georgia is "GS" so do not store "SG".

There are some HTML files in `ckanext/inppschema/templates/package/snippets` but these should *not* be edited. They have been customised to display certain fields in the correct place on the page but most of the contents are modified automatically by the script described above.

See https://docs.ckan.org/en/2.9/extensions/adding-custom-fields.html

The ckanext/inppschema directory contains a README.md with more details.

The ckanext/inppschema/tools directory contains some utilities and a README.md with more details.
