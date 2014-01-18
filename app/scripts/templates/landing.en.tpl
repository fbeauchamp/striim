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
<a href="https://github.com/fbeauchamp/striim"><img style="position: absolute; top: 0; right: 0; border: 0;"
                                      src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png"
                                      alt="Fork me on GitHub"></a>
<div class="row" id="landing">
    <!--<a href="https://github.com/you"><img style="position: absolute; top: 0; right: 0; border: 0;" src="https://s3.amazonaws.com/github/ribbons/forkme_right_gray_6d6d6d.png" alt="Fork me on GitHub"></a>-->

    <div id="form-container">
        <form id="landingForm" class="large-offset-3 large-6  medium-offset-2 medium-8 small-12 ">


            <h2 style="text-align:center">You are almost ready to exchange </h2>

            <div class="row collapse">

                <label><span class="big">1</span> - Pick a user name (optional)</label>

                <div class="small-11 column ">
                    <input type="text" placeholder="username, secret agent id,..." name="name" id="pseudo"
                           value="{{pseudo}}">
                </div>
                <div class="small-1 column">
                    <a class="button postfix    " data-tooltip
                       title="Choose a username to help other participant identify you">?</a>
                </div>

            </div>
            <div class="row collapse">

                <label><span class="big">2</span> - which room do you want to join ? </label>

                <div class="medium-1 column show-for-medium-up">
                    <a class="button prefix" title="generate a random room name from wikipedia " data-tooltip
                       id="refresh-room-name"><i
                                class="fi-refresh"></i></a>
                </div>
                <div class="small-11 medium-10 column ">
                    <input type="text" placeholder="Room name " name="roomname" value="{{room}}">
                </div>
                <div class="small-1 column  ">
                    <a class="button postfix  " data-tooltip
                       title="The name of a room you want to join or create">?</a>
                </div>
            </div>

            <button type="submit" class="button success small-12 "><span class="big">3</span> - Let's go</button>

        </form>
    </div>
    <div class="row" id="why-how-who">
        <div class=" medium-4 columns" style="text-align:justify">
            <div class="panel radius ">
                <h4>Goal</h4>

                <p> Stri.im is a web app aiming to ease <b>videoconferencing</b> and <b>document sharing</b>.
                </p>
                <ul class="no-bullet">
                    <li><i class="fi-page-pdf"></i> Show a pdf from your computer, your dropbox or your <abbr
                                title="Entreprise Content Management: alfresco, MS sharepoint, EMC documentum">ECM </abbr>
                    </li>
                    <li><i class="fi-comment-video"></i> Make live audio, video or text comments
                    </li>
                    <li><i class="fi-shield"></i> Install nothing, signin nowhere.</li>
                    <li><i class="fi-laptop"></i> From your desktop, laptop, tablet or smartphone.
                    </li>
                </ul>
                <!--<button class="button small ">En savoir plus</button>-->
            </div>
        </div>
        <div class=" medium-4 columns">
            <div class="panel radius ">
                <h4>Why a new tool ? </h4>
                <ul>
                    <li><i class="fi-check"></i> I wasn't satisfied by the solutions availables, they were too expensive
                        or too complex (or both).
                    </li>
                    <li><i class="fi-check"></i> I'm curious</li>
                    <li><i class="fi-check"></i> I wanted to test theses edge technologies.</li>
                </ul>
            </div>
        </div>
        <div class=" medium-4 columns" style="text-align:justify">
            <div class="panel radius ">
                <h4>Who did it ? </h4>

                <p>
                    By <a target="_blank" href="http://cv.stri.im" title="my resume, in french">Florent BEAUCHAMP</a>, a
                    french engineer, 33yo,
                    father of two, living near <a target="_blank"
                                                  href="https://maps.google.com/maps?q=macon,frannce&hl=fr&ie=UTF8&ll=47.115,0.439453&spn=18.984882,17.402344&sll=32.831241,-83.686321&sspn=0.183043,0.135956&t=h&hnear=M%C3%A2con,+Sa%C3%B4ne-et-Loire,+Bourgogne,+France&z=6">Mâcon
                        (France)</a>
                </p>

                <p>Special thanks to Jean Philippe BOURGEON, whom lend me this domain, initially bought to win <a
                            href="http://www.opendata71.fr/toutes-les-applications" target="_blank">
                        OpenData71</a>.</p>
            </div>
        </div>
    </div>


</div>