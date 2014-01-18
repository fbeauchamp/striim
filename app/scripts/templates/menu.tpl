


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
                       title="la salle de réunion dans laquelle vous êtes.Partagez ce lien avec vos collaborateurs"
                       data-dropdown="room-information"
                       href="#"> {{room}}</a>
                </li>
                <li class="has-form" ><a href="#leave" data-dropdown="really-quit" class="alert button "  id="room-leave"
                       title="cliquez pour vous déconnecter de cette salle"><i class="fi-x"></i><span>Quitter</span></a></li>
            </ul>
        </section>
    </nav>
</div>

<div  id="room-information" data-dropdown-content class="f-dropdown content medium" >

        <p>Copiez  ce lien et transmettez la aux personnes qui veulent rejoindre cette salle</p>
    <input type="text" disabled value="{{{url}}}#/join/{{room}}/">

</div>
<div  id="really-quit" data-dropdown-content class="f-dropdown content" >
        <p>Etes vous sûr ? </p>
    <a href="#leave" class="alert button "   title="cliquez pour vous déconnecter de cette salle"> Quitter la salle </a>

</div>

<!-- /.top-bar -->