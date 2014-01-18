# Stri.im
Stri.im is a web app aiming to ease videoconferencing  and  live document sharing :
* Show a pdf from your computer, your dropbox or your ECM
* Make live audio, video or text comments
* Install nothing, signin nowhere.
* From your desktop, laptop, tablet or smartphone.

When showing a PDF, all the users of your room see your pointer.

Most of the data doesn't even pass through the server, and the rest is not recorded (except for the notepad,
based on [etherpad lite](http://etherpad.org/)).


## Demo time
A demo is available at https://stri.im/ . That demo use [a demo server from alfresco](http://cmis.alfresco.com)  to
show the integration of an ECM.

##Compatibility
WebRTC is used to make audio and video conferencing. It's currently supported by Firefox, Chrome and Opera on destkop,
and by Firefox and Chrome on Android. You're out of luck on IOS/WP8.

All others functionnalities should be ok on any recent browser and any size of screen (300px wide and more). Fill a bug
if something seems off.

## Install
    git clone https://github.com/fbeauchamp/striim.git client
    cd client
    bower install && npm install && grunt build

 The client is ready , no you'll have to install the Striim-server, which will be available soon.
