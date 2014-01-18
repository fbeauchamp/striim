<ul class="cmis-browser">
    {{#objects}}
    {{#object.succinctProperties}}
    <li data-cmis-object-id="{{cmis:objectId}}" data-cmis-type="{{cmis:baseTypeId}}" data-cmis-mime-type="{{cmis:contentStreamMimeType}}">

        <i class="icon"></i> {{cmis:name}}
    </li>
    {{/object.succinctProperties}}
    {{/objects}}
</ul>