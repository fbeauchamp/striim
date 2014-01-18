<div class="contain-to-grid">
    <nav class="top-bar" data-topbar>
        <ul class="title-area">
            <!-- Title Area -->
            <li class="name">
                <h1>
                    <a>Stri.im</a>
                </h1>
            </li>
        </ul>
    </nav>
</div>
<div class="row" id="landing">
    <!--<a href="https://github.com/you"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub"></a>-->

    <div id="form-container">
        <form id="landingForm" class="large-offset-3 large-6  medium-offset-2 medium-8 small-12 ">


            <h2 style="text-align:center">Vous êtes presque prêt à échanger </h2>

            <div class="row collapse">

                <label><span class="big">1</span> - Qui êtes vous ? </label>

                <div class="small-11 column ">
                    <input type="text" placeholder="pseudo ou nom ou code d'agent secret" name="name" id="pseudo" value="{{pseudo}}">
                </div>
                <div class="small-1 column">
                    <a class="button postfix    " data-tooltip
                       title="Entrez un nom pour permettre aux autres participants de vous identifier">?</a>
                </div>

            </div>
            <div class="row collapse">

                <label><span class="big">2</span> - Dans quel salon de discussion voulez vous aller ? </label>

                <div class="medium-1 column show-for-medium-up">
                    <a class="button prefix" title="choisir un autre nom de salon  au hasard  " data-tooltip
                       id="refresh-room-name"><i
                                class="fi-refresh"></i></a>
                </div>
                <div class="small-11 medium-10 column ">
                    <input type="text" placeholder="Quel est le nom de la salle ? " name="roomname" value="{{room}}">
                </div>
                <div class="small-1 column  ">
                    <a class="button postfix  " data-tooltip
                       title="Entrez le nom d'une salle à rejoindre ou de celle que vous souhaitez créer">?</a>
                </div>
            </div>

            <button type="submit" class="button success small-12 "><span class="big">3</span> - C'est parti</button>

        </form>
    </div>
    <div class="row" id="why-how-who">
        <div class=" medium-4 columns" style="text-align:justify">
            <div class="panel radius ">
                <h4>Ca sert à quoi ? </h4>

                <p> Stri.im est une application web de <b>visio conférence</b> et de
                    <b>partage de documents</b>.
                </p>
                <ul class="no-bullet" >
                    <li><i class="fi-page-pdf"></i> partagez  un pdf depuis votre ordinateur, votre dropbox ou votre <abbr title="Entreprise Content Management : Gestion de contenu en entreprise">ECM </abbr> </li>
                    <li><i class="fi-comment-video"></i> accompagnez le de vos commentaires videos , audios ou textuels</li>
                    <li><i class="fi-shield"></i> Sans rien installer, ni créer de compte.</li>
                    <li><i class="fi-laptop"></i> Depuis votre PC portable ou fixe, votre tablette, votre smartphone.</li>
                </ul>
                <!--<button class="button small ">En savoir plus</button>-->
            </div>
        </div>
        <div class=" medium-4 columns">
            <div class="panel radius ">
                <h4>Pourquoi un nouvel outil ? </h4>
                <ul>
                    <li><i class="fi-check"></i> Parceque ce que j'ai vu ne me satisfaisait pas, soit en terme de
                        fonctionnalité, soit en terme de coût.
                    </li>
                    <li><i class="fi-check"></i> Pour satisfaire ma curiosité</li>
                    <li><i class="fi-check"></i> Pour tester des technologies toutes récentes</li>
                </ul>
            </div>
        </div>
        <div class=" medium-4 columns" style="text-align:justify">
            <div class="panel radius ">
                <h4>C'est fait par qui ? </h4>

                <p>
                    Par <a target="_blank" href="http://cv.stri.im">Florent BEAUCHAMP</a>, ingénieur territorial de 33
                    ans, père de deux enfants, <a target="_blank"
                                                                                         href="https://maps.google.com/maps?q=macon,frannce&hl=fr&ie=UTF8&ll=47.115,0.439453&spn=18.984882,17.402344&sll=32.831241,-83.686321&sspn=0.183043,0.135956&t=h&hnear=M%C3%A2con,+Sa%C3%B4ne-et-Loire,+Bourgogne,+France&z=6">Mâcon</a>
                </p>

                <p>Je remercie Jean Philippe BOURGEON qui m'autorise gracieusement à utiliser ce nom de domaine que
                    nous avions initialement acheté pour remporter le <a href="http://www.opendata71.fr/toutes-les-applications" target="_blank">concours OpenData71</a>.</p>
            </div>
        </div>
    </div>


</div>