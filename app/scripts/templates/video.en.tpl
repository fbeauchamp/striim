<div class="stream-container video">
    <p class="stream-label">
        {{#remote}}
        Video
        {{/remote}}
        {{^remote}}
        from :{{videolabel}}
        {{/remote}}</p>
    <video src="" autoplay=true></video>
    <div class="button-container">
        <a class="button alert video-status paused"><i class="fi-pause"></i><span>video paused</span></a>
        <a class="button video-status playing"><i class="fi-video"></i><span>video playing</span></a>
        <a class="button alert audio-status muted"><i class="fi-volume-strike"></i><span>with audio </span></a>
        <a class="button audio-status nonmuted"><i class="fi-volume"></i><span>without audio </span></a>
        {{#remote}}
        <a class="button alert expand-status expanded" href="#home"><i class="fi-arrows-compress"></i><span> compress</span></a>
        <a class="button expand-status nonexpanded" href="#video/{{peerId}}/{{videoId}}"><i class="fi-arrows-expand"></i><span> expand</span></a>
        {{/remote}}
    </div>
</div>