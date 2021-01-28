# Installation

You MUST create two files: `ckan_ip.txt` contains the IP address of your CKAN server, or it may be the name `localhost`, and `ckan_api_key.txt` contains the API key of your sysadmin
 account (or an account which has sufficient permissions). The API key can be found once logged into CKAN on your profile page (it's at the bottom of the left-hand column).
These values were hard-coded into the scripts which caused problems so they are now read from config files.

After entering your virtual environment you should `pip install ckanapi`

Remember to make the symbolic link as described in this plugin's README.

# Groups

List of groups (themes or topic categories) to be created inside CKAN.

Master list is `topic_categories.csv`

## File format

csvname,group,title,description,logo

The csvname is the name used in the topic_category column of the metadata_FK CSV file
so that we can map from the topic_category field to a group name.
The group field is the short group name which is used in the URL.
The title is a one line description and the description can be longer.
The logo file is the image filename which will have /logo/ prepended
and will be found via the symbolic link as described above.

## Add groups from CSV into CKAN

Run `./ckan_add_groups.py`

If a group already exists then it will be updated.

NOTE: See Troubleshooting below.

## Rename Groups to Themes

Run `rename_groups_to_themes.sh` to change the wording of Groups in the interface to use Themes instead. Does not replace all occurrences, only the main ones. This modifies your ckan installation outside this plugin.

# Organisations

List of organisations to be created inside CKAN. File should be called `organisation_list.csv`

Master list was grouped_organisations_ready_2018-12-07.csv

Modified by arb grouped_organisations_ready_arb.csv (for changes see below)

Note that it is spelled with a z inside CKAN as organizations.

## File format

organisation,organisation_name,organisation_logo,records_count

## List organisations already in CKAN

Run `./ckan_list_organisations.py`

## Add organisations from CSV into CKAN

Run `./ckan_add_organisations.py`

If an organisation already exists then it will be updated.

NOTE: See Troubleshooting below.

## Update the organisations

There are some organisations which do not have a logo image.
They will show the CKAN default image.
This could be modified to show the nologo_cube.png file if required.

Do NOT change the organisation code because it will have been
embedded into dataset records in the database.

## Troubleshooting

The behavior when a group/organisation already exists is to 'update' it.
This means to replace the original values with the new values.
If any changes have been made within CKAN to add an attribute to the group/org which does not exist in the new info being uploaded from the CSV then it will be lost.
The alternative behaviour is to 'patch' where only the values specfied in the CSV are upload and other existing values are preserved.
You need to edit the script to change `package_update` to `package_patch` if you want this behaviour.

There is one slight problem when updating the logo image for a group/org; sometimes the logo is not updated.
If this happens (and you've definitely restarted apache2 and forcibly-reloaded the browser window without caching) you need to edit the script and enable the `clear_upload` flag then re-run the script.

## SOMETHING TO BE AWARE

In the list of organisations watch out for some errors such as spaces, duplicated entry, capitalisation, etc. Also renamed .jpeg to .jpg and made all logo filenames lowercase (they were already lowercase in the CSV but not as files).
