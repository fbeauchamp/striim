<div class="stream-container audio">
    <p class="stream-label">


        {{#remote}}
        audio
        {{/remote}}
        {{^remote}}
        micro : {{audiolabel}}
        {{/remote}}</p>

    <div class="button-container">
        <a class="button alert audio-status muted"><i class="fi-volume-strike"></i><span> without audio</span></a>
        <a class="button audio-status nonmuted"><i class="fi-volume"></i><span> with audio</span></a>
    </div>
    <audio src="" autoplay=true></audio>
</div>