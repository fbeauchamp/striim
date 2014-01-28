<div class="row collapse" id="fileadd-container">
    <div class="small-4 columns"   title="upload a pdf">
        <div>
            <form action="/file-upload" id="uploader">
               <i class=" fi-upload"></i><span> Upload</span>

                <div class="fallback">
                    <input name="file" type="file"  multiple/>
                </div>
            </form>

        </div>
    </div>
    <div class="small-4 columns"   title="take a pdf from your dropbox">
        <div id="dropbox-chooser" >
                <i class=" fi-social-dropbox"></i><span> Dropbox</span>

        </div>
    </div>
    <div class="small-4 columns"  title="take a pdf from Alfresco">
        <div id="cmis-chooser" >
                <i >A</i><span> Alfresco</span>

        </div>
    </div>
</div>

<div id="cmis-chooser-reveal"class="reveal-modal" data-reveal>
    <h2>cmis.alfresco.com</h2>
    <div class="browser"></div>
    <a class="close-reveal-modal">&#215;</a>
</div>