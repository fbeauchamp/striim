<div class="contain-to-grid">
    <nav class="top-bar" data-topbar>
        <ul class="title-area">
            <!-- Title Area -->
            <li class="name">
                <h1>
                    <a>Stri.im</a>
                </h1>
            </li>
            <li class="toggle-topbar menu-icon"><a href="#"><span>Menu</span></a></li>
        </ul>
        <!-- /.title-area -->

        <!-- Left Nav Section -->
        <!-- /.top-bar-section -->
        <section class="top-bar-section">
            <ul class="right" id="shared-doc-list">

            </ul>
            <ul class="left">
                <li class="has-form"><a class="button"
                                        id="room-name"
                                        title="show more details on this room"
                                        data-dropdown="room-information"
                                        href="#"> {{room}}</a>
                </li>
                <li class="has-form"><a href="#leave" data-dropdown="really-quit" class="alert button " id="room-leave"
                                        title="quit this room "><i class="fi-x"></i><span>Quitter</span></a>
                </li>
            </ul>
        </section>
    </nav>
</div>

<div id="room-information" data-dropdown-content class="f-dropdown content medium">
    <p>How to get started ?</p>
    <h4>Direct link method</h4>
    <p>Copy and share this link to others. They'll join the room as soon as they click it.</p>
    <input type="text" disabled value="{{{url}}}#/join/{{room}}/">
    <hr>
    <h4>Alternative method</h4>
    <p>You can   ask  them to go at this adress : </p>
    <input type="text" disabled value="{{{url}}}">
    <p>And then  use this room name : </p>
    <input type="text" disabled value="{{room}}">
</div>
<div id="really-quit" data-dropdown-content class="f-dropdown content">
    <p>Do you really want to leave this room ? </p>
    <a href="#leave" class="alert button " title="click here to leave this room"> Leave this room </a>

</div>

<!-- /.top-bar -->