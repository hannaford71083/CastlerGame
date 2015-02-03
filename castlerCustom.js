


// ------------------------------------- Player class	------------------------------------
function Player(number, gold, name) {
    this.number = number
    this.gold = gold;
    this.name = name;
    this.farms = 0;
    this.castles = 1;
    this.knights = 0;
}

//-------------------------------------- Declare other classes     ----------------------------------
function Game() {

}


function Grid() {
    this.tileMap = [];
    //no initialisation of grid as arrays added to original array as and when needed
}








tile = {
    width: 32,
    height: 32
}

//maximum extent of grid
grid = {
    width: 288,
    height: 288
}

/*
Keys = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
}
*/

scroll = {
    x: 0,
    y: 0
}




game = new Game();
gridTiles = new Grid();




$(document).ready(function () {


    //window.onload = function () {

    //-------------------------------------- Game class     ----------------------------------


    //method of function using js object with prototyping
    Game.prototype.initialise = function () {
        this.status = "farm";
        this.player1 = new Player(1, 20, "David Hannaford");
        this.player2 = new Player(2, 20, "Bill Deutrieve");
        this.currentPlayer = this.player1; //enter appropriate details in here
        this.firstPlayerOfTurn = this.player1;
        this.checkForAttack = false;
        this.checkForAttackSubSqr = null;

        if (gridTiles.tileMap[1] == null) {
            gridTiles.tileMap[1] = [];
        }

        if (gridTiles.tileMap[7] == null) {
            gridTiles.tileMap[7] = [];
        }

        tileValue1 = {
            player: 1,
            building: "castle"
        }
        gridTiles.tileMap[1][1] = tileValue1;

        tileValue2 = {
            player: 2,
            building: "castle"
        }

        gridTiles.tileMap[7][7] = tileValue2;

        draw();
    }

    //determine value to input to map depending on turn/status
    Game.prototype.determineTileValue = function (row, column) {

        //value is determined by what a player has selected
        //AND what is the phase

        // farming phase
        // IF select unoccupied square and is adjacent to current player then
        //castle in center


        // IF select unoccupied square and is Not adjacent to current player
        //do nothing - In Help section show error
        // IF occupied then
        // do nothing - In Help section show error

        var isCastle;
        if (row == 1 && column == 1) {
            isCastle = true;
            alert("isCastle = true");
        }


        building = "";
        if (document.getElementById("actionRadioFarm").checked) { building = "farm"; }
        //if (document.getElementById("actionRadioCastle").checked){ 	building="castle"; }
        if (document.getElementById("actionRadioKnight").checked) { building = "knight"; }


        tileValue = {
            player: this.currentPlayer.number,
            building: building
        }

        return tileValue;
    }




    Game.prototype.checkForVictory = function (grid) {

    }

    //also swaps status
    Game.prototype.swapPlayer = function () {
        //currently only two players rewrite mehtod to include more players

        if (this.firstPlayerOfTurn == this.currentPlayer && this.status == "farm") {
            this.currentPlayer = this.player2;
            document.getElementById("goldSpan").innerHTML = this.currentPlayer.gold;
        }
        else if (this.firstPlayerOfTurn != this.currentPlayer && this.status == "farm") {
            this.currentPlayer = this.player1;
            this.status = "fight";
            document.getElementById("goldSpan").innerHTML = this.currentPlayer.gold;
        }
        else if (this.firstPlayerOfTurn == this.currentPlayer && this.status == "fight") {
            this.currentPlayer = this.player2;
            document.getElementById("goldSpan").innerHTML = this.currentPlayer.gold;
        }
        else if (this.firstPlayerOfTurn != this.currentPlayer && this.status == "fight") {
            this.calculateGold();
            this.currentPlayer = this.player1;
            this.status = "farm";
            document.getElementById("goldSpan").innerHTML = this.currentPlayer.gold;
        }

        document.getElementById('playerSpan').innerHTML = game.currentPlayer.number;
        document.getElementById('statusSpan').innerHTML = game.status;
        alert("Player " + this.currentPlayer.number + " has started the " + this.status + "ing Phase");
    }

    Game.prototype.calculateGold = function () {
        var farmIncome = 2;
        var castleIncome = -4;
        var knightIncome = -3;

        var player1gold = this.player1.gold +
                            (this.player1.farms * farmIncome) +
                            (this.player1.castles * castleIncome) +
                            (this.player1.knights * knightIncome);
        this.player1.gold = player1gold;

        var player2gold = this.player2.gold +
                            (this.player2.farms * farmIncome) +
                            (this.player2.castles * castleIncome) +
                            (this.player2.knights * knightIncome);
        this.player2.gold = player2gold;
        //alert("player1gold : " + player1gold + "player2gold : " + player2gold);
    }



    //--------------------------------------  Class Grid ------------------------------------------------


    //grid is split into larger 3x3 squares
    Grid.prototype.getSubSquare = function (row, col) {
        subSquare = {
            Row: Math.floor(row / 3),
            Col: Math.floor(col / 3)
        }
        return subSquare;
    }


    Grid.prototype.colourPlayerColour = function (subSquare, player) {
        //gridTiles.colourPlayerColour(subSquare)
        var row = subSquare.Row;
        var col = subSquare.Col;
        var xCoord = row * 96;
        var yCoord = col * 96;
        var redSquare = new Image();
        redSquare.src = "img/redSquare.png";
        var blueSquare = new Image();
        blueSquare.src = "img/blueSquare.png";

        var playerColourSquare;
        //alert("player : "+ game.currentPlayer.number);
        if (player == 1) {
            //use red square
            playerColourSquare = blueSquare;
        }
        else {
            //player is 2 : use blue square
            playerColourSquare = redSquare;
        }

        c.drawImage(playerColourSquare, Math.round(xCoord), Math.round(yCoord), 96, 96);
        return 0;
    }

    //return player of last occupied cell (i.e. at end of loop)
    Grid.prototype.scanSubSqareReturnPlayer = function (subsqr) {
        var player = 0;
        var subSqrRow = subsqr.Row;
        var subSqrCol = subsqr.Col;

        var colFrom = subSqrCol * 3;
        var colTo = (subSqrCol * 3) + 2;

        var rowFrom = subSqrRow * 3;
        var rowTo = (subSqrRow * 3) + 2;

        //scan through all the rows and collumns for the subsquare
        for (var row = rowFrom; row <= rowTo; row++) {
            for (var col = colFrom; col <= colTo; col++) {
                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].player != null) {
                        player = gridTiles.tileMap[row][col].player;
                    }
                }
            }
        }
        return player;
    }



    Grid.prototype.validate = function (row, column) {
        var errorObj;

        //TILE OCCUPIED BY FARM/CASTLE/KNIGHT?
        errorObj = gridTiles.checkTileOccupied(row, column);
        if (errorObj.isError == "1") { return errorObj; }

        //SUBSQUARE OCCUPIED BY OTHER PLAYER?
        errorObj = gridTiles.checkSubsquareOccupied(row, column);

        return errorObj;
    }


    Grid.prototype.checkTileOccupied = function (row, column) {
        if (gridTiles.tileMap[row] == null) {
            error = {
                isError: 0,
                message: "valid move"
            }
            return error;
        } else if (gridTiles.tileMap[row][column] == null) {
            //may chan multiple versions of these i.e catle == 2, knight == 3
            error = {
                isError: 0,
                message: "valid move"
            }
            return error;
        }
        else {
            //may chan multiple versions of these i.e catle == 2, knight == 3
            //(this.tileMap[row][column] == 1)
            error = {
                isError: 1,
                message: "Tile already occupied, please choose another tile"
            }
            return error;
        }
    }


    Grid.prototype.checkSubsquareOccupied = function (row, column) {
        var subsqr = this.getSubSquare(row, column);
        var currentPlayer = game.currentPlayer.number;
        //scan subsquare for farms/knights/castles
        var playerInSbSqr = this.scanSubSqareReturnPlayer(subsqr);

        if (playerInSbSqr == 0) {
            //player = 0 means not currently occupied
            var error = {
                isError: 0,
                message: "valid move"
            }
        }
        else {
            if (playerInSbSqr == game.currentPlayer.number) {
                var error = {
                    isError: 0,
                    message: "valid move"
                }
            }
            else {
                error = {
                    isError: 1,
                    message: "Sub-Sqare is currently occupied by other player"
                }
            }
        }

        return error;
    }




    Grid.prototype.isSubSquareAdjacent = function (subSqr, currentPlayer) {
        var isAdjacent = false;

        //subSqr
        //currentPlayer
        //determine what subsquares are adjacent

        //FIRST ROW
        if (subSqr.Row == 0 && subSqr.Col == 0) {
            if (gridTiles.checkPlayerInSubSquare(0, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 0) == true) { isAdjacent = true; };
            //alert("0,0 isAdjacent : " + isAdjacent);
        }
        if (subSqr.Row == 1 && subSqr.Col == 0) {
            if (gridTiles.checkPlayerInSubSquare(0, 0) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(2, 0) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 1) == true) { isAdjacent = true; };
            //alert("1,0   isAdjacent : " + isAdjacent);
        }
        if (subSqr.Row == 2 && subSqr.Col == 0) {
            if (gridTiles.checkPlayerInSubSquare(2, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 0) == true) { isAdjacent = true; };
            //alert("2,0 isAdjacent : " + isAdjacent);
        }


        //MIDDLE ROW
        if (subSqr.Row == 0 && subSqr.Col == 1) {
            if (gridTiles.checkPlayerInSubSquare(0, 0) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(0, 2) == true) { isAdjacent = true; };
        }

        if (subSqr.Row == 1 && subSqr.Col == 1) {
            if (gridTiles.checkPlayerInSubSquare(1, 0) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(0, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(2, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 2) == true) { isAdjacent = true; };

        }

        if (subSqr.Row == 2 && subSqr.Col == 1) {
            if (gridTiles.checkPlayerInSubSquare(2, 0) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(2, 2) == true) { isAdjacent = true; };
        }


        //BOTTOM ROW
        if (subSqr.Row == 0 && subSqr.Col == 2) {
            if (gridTiles.checkPlayerInSubSquare(0, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 2) == true) { isAdjacent = true; };
        }

        if (subSqr.Row == 1 && subSqr.Col == 2) {
            if (gridTiles.checkPlayerInSubSquare(0, 2) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(2, 2) == true) { isAdjacent = true; };
        }

        if (subSqr.Row == 2 && subSqr.Col == 2) {
            if (gridTiles.checkPlayerInSubSquare(2, 1) == true) { isAdjacent = true; };
            if (gridTiles.checkPlayerInSubSquare(1, 2) == true) { isAdjacent = true; };
        }


        //alert("subSqr.Row " + subSqr.Row + " , subSqr.Col " + subSqr.Col + "        isAdjacent : "+ isAdjacent );

        return isAdjacent;
    }


    Grid.prototype.checkPlayerInSubSquare = function (row, col) {
        //create subsqaure
        subsqr = {
            Row: row,
            Col: col
        }


        var playerInSbSqr = this.scanSubSqareReturnPlayer(subsqr);
        //alert("check " +  row + " , " + col + "   --- player --->   " + playerInSbSqr);

        var currentPlayer = game.currentPlayer.number;

        if (playerInSbSqr == currentPlayer) {
            //alert("subsqr.Row " + subsqr.Row + "subsqr.Col" + subsqr.Col + " - TRUE ");
            return true;
        }
        else {
            //alert("subsqr.Row " + subsqr.Row + "subsqr.Col" + subsqr.Col + " - TRUE ");
            return false;
        }

    }


    //whatsInSubsquare( subSquare , buildingToFind )
    Grid.prototype.whatsInSubsquare = function (subsqr, buildingToFind) {

        var buildingQty = 0;

        var subSqrRow = subsqr.Row;
        var subSqrCol = subsqr.Col;

        var colFrom = subSqrCol * 3;
        var colTo = (subSqrCol * 3) + 2;

        var rowFrom = subSqrRow * 3;
        var rowTo = (subSqrRow * 3) + 2;

        //scan through all the rows and collumns for the subsquare
        for (var row = rowFrom; row <= rowTo; row++) {
            for (var col = colFrom; col <= colTo; col++) {
                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].player != null) {
                        if (buildingToFind == gridTiles.tileMap[row][col].building) {
                            buildingQty++;
                            //alert ("name " + gridTiles.tileMap[row][col].building + " , buildingQty " + buildingQty);
                        }
                    }
                }
            }
        }
        return buildingQty;
    }



    //changePlayerInSubsquare( subSquare , playerNo )
    Grid.prototype.changePlayerInSubsquare = function (subsqr, playerNo) {

        var subSqrRow = subsqr.Row;
        var subSqrCol = subsqr.Col;

        var colFrom = subSqrCol * 3;
        var colTo = (subSqrCol * 3) + 2;

        var rowFrom = subSqrRow * 3;
        var rowTo = (subSqrRow * 3) + 2;

        //scan through all the rows and collumns for the subsquare
        for (var row = rowFrom; row <= rowTo; row++) {
            for (var col = colFrom; col <= colTo; col++) {
                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].player != null) {
                        if ("knight" == gridTiles.tileMap[row][col].building) {
                            gridTiles.tileMap[row][col].player = playerNo;
                            //alert ("name " + gridTiles.tileMap[row][col].building + " , buildingQty " + buildingQty);
                        }
                        else if ("farm" == gridTiles.tileMap[row][col].building) {
                            gridTiles.tileMap[row][col].player = playerNo;
                        }
                        else if ("castle" == gridTiles.tileMap[row][col].building) {
                            gridTiles.tileMap[row][col].player = playerNo;
                        }


                    }
                }
            }
        }

        return false;
    }




    Grid.prototype.removeBuildingsFromSubsquare = function (subSquare, buildingToFind, noToRemove) {

        var subSqrRow = subsqr.Row;
        var subSqrCol = subsqr.Col;

        var colFrom = subSqrCol * 3;
        var colTo = (subSqrCol * 3) + 2;

        var rowFrom = subSqrRow * 3;
        var rowTo = (subSqrRow * 3) + 2;

        //scan through all the rows and collumns for the subsquare
        for (var row = rowFrom; row <= rowTo; row++) {
            for (var col = colFrom; col <= colTo; col++) {
                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].player != null) {
                        if (buildingToFind == gridTiles.tileMap[row][col].building) {

                            if (noToRemove > 0) {
                                gridTiles.tileMap[row][col].building = null;
                                noToRemove--;
                                //alert ("name " + gridTiles.tileMap[row][col].building + " , buildingQty " + buildingQty);
                            }
                        }
                    }
                }
            }
        }
        return false;

    }




    Grid.prototype.randomlyAddBuildingsToSubsquare = function (subSquare, buildingToAdd, noToAdd) {

        var subSqrRow = subsqr.Row;
        var subSqrCol = subsqr.Col;

        var colFrom = subSqrCol * 3;
        var colTo = (subSqrCol * 3) + 2;

        var rowFrom = subSqrRow * 3;
        var rowTo = (subSqrRow * 3) + 2;

        //scan through all the rows and columns for the subsquare
        for (var row = rowFrom; row <= rowTo; row++) {
            for (var col = colFrom; col <= colTo; col++) {
                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].player != null) {

                        //if not already that building type or not castle then insert building
                        //NB: this is not random, v2 improvement??
                        if (gridTiles.tileMap[row][col].building != buildingToAdd || gridTiles.tileMap[row][col].building != "castle") {
                            if (noToRemove > 0) {

                                gridTiles.tileMap[row][col].building = buildingToAdd;
                                noToRemove--;
                                alert("name " + gridTiles.tileMap[row][col].building + " , buildingQty " + buildingQty);
                            }
                        }



                    }
                }
            }
        }
        return false;

    }




    









    //-------------------------------------- **** MAIN PROGRAM **** --------------------------------------




    canvas = document.getElementById('myCanvas');
    c = canvas.getContext('2d');
    canvas.addEventListener('click', handleClick, false);

    userInterface = document.getElementById('userInterface');


    userInterface.addEventListener('click', handleClick, false);

    game.initialise();

    //alert("gold for current player : " + game.currentPlayer.name);
    draw();
    alert("Player " + game.currentPlayer.number + " please start your " + game.status + "ing phase");

    document.getElementById('playerSpan').innerHTML = game.currentPlayer.number;
    document.getElementById('statusSpan').innerHTML = game.status;
    document.getElementById('goldSpan').innerHTML = game.currentPlayer.gold;




    function handleClick(e) {
        var target = e.target.getAttribute('id');
        //on button press
        if (target == "finishGo") {
            game.swapPlayer();
            return 0;
        }

        //checkfor victory
        //game.checkForVictory (grid)


        // When a click is detected, translate the mouse coordinates to pixel coordinates
        var row = Math.floor((e.clientX + scroll.x) / tile.width);
        var column = Math.floor((e.clientY + scroll.y) / tile.height);

        var errorObj = gridTiles.validate(row, column);


        if (game.status == "farm") {

            if (errorObj.isError == 0) {

                if (gridTiles.tileMap[row] == null) {
                    gridTiles.tileMap[row] = [];
                }

                //alert("Tile building is " + game.determineTileValue().building);
                var subSqr = gridTiles.getSubSquare(row, column);
                var currentPlayer = game.currentPlayer.number;
                //alert("subSqr " + subSqr + ", currentPlayer "+ currentPlayer);

                var isAdjacent = gridTiles.isSubSquareAdjacent(subSqr, currentPlayer);

                var validSub = gridTiles.checkPlayerInSubSquare(subSqr.Row, subSqr.Col);


                if (isAdjacent || validSub) {
                    var canAfford = true;
                    var currentPlayerInSubsqr = gridTiles.scanSubSqareReturnPlayer(subSqr);

                    if (currentPlayer == currentPlayerInSubsqr) {
                        var building = "";
                        if (document.getElementById("actionRadioFarm").checked) {
                            building = "farm";
                            //check if can afford
                            var farmCost = 3;
                            if (farmCost <= game.currentPlayer.gold) {
                                game.currentPlayer.gold = game.currentPlayer.gold - farmCost;
                                //alert("game.currentPlayer.gold "+ game.currentPlayer.gold);
                                document.getElementById('goldSpan').innerHTML = game.currentPlayer.gold;
                                canAfford = true;
                                game.currentPlayer.farms++;
                            }
                            else {
                                canAfford = false;
                            }
                        }
                        //if (document.getElementById("actionRadioCastle").checked){ 	building="castle"; }
                        if (document.getElementById("actionRadioKnight").checked) {
                            building = "knight";
                            var knightCost = 5;
                            if (knightCost <= game.currentPlayer.gold) {
                                game.currentPlayer.gold = game.currentPlayer.gold - knightCost;
                                //alert("game.currentPlayer.gold "+ game.currentPlayer.gold);
                                document.getElementById('goldSpan').innerHTML = game.currentPlayer.gold;
                                canAfford = true;
                                game.currentPlayer.knights++;
                            }
                            else {
                                canAfford = false;
                            }
                        }

                        tileValue = {
                            player: currentPlayer,
                            building: building
                        }

                        if (canAfford) {
                            gridTiles.tileMap[row][column] = tileValue;
                        }
                        else {
                            alert("Cannot afford this currently")
                        }
                    }
                    else if (currentPlayerInSubsqr == 0) {
                        tileValue = {
                            player: currentPlayer,
                            building: "castle"
                        }

                        var castleCost = 7;
                        if (castleCost <= game.currentPlayer.gold) {
                            game.currentPlayer.gold = game.currentPlayer.gold - castleCost;
                            //alert("game.currentPlayer.gold "+ game.currentPlayer.gold);
                            document.getElementById('goldSpan').innerHTML = game.currentPlayer.gold;
                            canAfford = true;
                            game.currentPlayer.castles++;
                        }
                        else {
                            canAfford = false;
                        }

                        if (canAfford) {
                            gridTiles.tileMap[row][column] = tileValue;
                        }
                        else {
                            alert("Cannot afford this currently")
                        }
                    }

                }
                else {
                    alert("Select adjacent teritory");
                }


            }
            else {
                alert(errorObj.message);
            }


        }
        else {

            //alert("Should work with starting tile??? coords : " + row + " , " + column);

            if (game.checkForAttack == true) {
                fromSubSqr = game.checkForAttackSubSqr;
                var toSubSqr = gridTiles.getSubSquare(row, column);
                var toPlayerNo = gridTiles.scanSubSqareReturnPlayer(toSubSqr);
                var isAdja = gridTiles.isSubSquareAdjacent(toSubSqr, game.currentPlayer.number)

                // check attack is valid
                var isValidMove = true
                if (!isAdja) {
                    isValidMove = false;
                    alert("!isAdja");
                }
                if (toPlayerNo == 0) {
                    isValidMove = false;
                    alert("toPlayerNo == 0");
                }
                if (toPlayerNo == game.currentPlayer.number) {
                    isValidMove = false;
                    alert("toPlayerNo == game.currentPlayer.number");
                }

                // ****************************** BATTLE MECHANIC ******************************
                if (isValidMove == true) {
                    alert("Invasion in Progress");

                    var invadingKnights = 0;
                    var defendingKnights = 0;

                    alert("FROM \n ss row" + fromSubSqr.Row + ",  ssCol" + fromSubSqr.Col);
                    var buildingToFind = "knight"
                    var invadingKnights = gridTiles.whatsInSubsquare(fromSubSqr, buildingToFind)
                    alert("invadingKnights : " + invadingKnights);
                    //calculate number of knights in square assumed to be invading
                    //invadingKnights = 0;


                    alert("TO \n ss row" + toSubSqr.Row + ",  ssCol" + toSubSqr.Col);
                    var defendingKnights = gridTiles.whatsInSubsquare(toSubSqr, buildingToFind)
                    alert("defendingKnights : " + defendingKnights);

                    //****************** SIMPLE GAME MECHANIC - PLEASE IMPROVE!!!! ******************
                    var invadingKnightsAfter, defendingKnightsAfter;
                    if (invadingKnights > defendingKnights) {
                        invadingKnightsAfter = invadingKnights - defendingKnights;
                        defendingKnightsAfter = 0;
                        // invasion successful
                        if (toPlayerNo == 1) { newPlayerNo = 2; }
                        if (toPlayerNo == 2) { newPlayerNo = 1; }

                        var buildingToRemove = "knight";
                        var buildingToAdd = "knight";
                        var noToRemove = defendingKnights;
                        var noToAdd = invadingKnights;

                        gridTiles.changePlayerInSubsquare(toSubSqr, newPlayerNo);
                        gridTiles.removeBuildingsFromSubsquare(fromSubSqr, buildingToRemove, noToRemove);
                        //<<<<<<<<<<<<<<<<<<<<<-------------------------------------------------------------------------()<<<<<<<<<<<<<
                        //currently not correct logic - remove from toSubSqr
                        //gridTiles.removeBuildingsFromSubsquare( 	toSubSqr , buildingToRemove, 	noToRemove );
                        gridTiles.randomlyAddBuildingsToSubsquare(fromSubSqr, buildingToAdd, noToAdd); // ??? fully test this

                    }
                    else {
                        invadingKnightsAfter = 0
                        defendingKnightsAfter = defendingKnights - invadingKnights;
                        //*** remove killed knights ***
                    }

                    alert("invadingKnightsAfter : " + invadingKnightsAfter +
                        "\ndefendingKnightsAfter : " + defendingKnightsAfter);


                    //function removeBuildings(subsqr , building types )   knights from square
                    //change player for territory
                    //function randomly add knights to square

                    // "	 "	 	" 	defending
                    //defendingKnights = 0;


                    //var subSqr = gridTiles.getSubSquare(row,column);
                    //var buildingToFind = "knight"
                    //var knights = gridTiles.whatsInSubsquare( subSqr , buildingToFind )


                    //check if knights in fromSubSquare
                    //check if knights in toSubSquare
                    //---- simple attack mechanic (may want to put this as part of game object) ----
                    // one knight neutralises one enemy knight
                    // also need one knight to take castle
                    // if knightsFrom > knightsTo then
                    // invade
                    // knights in fromSubSqr = 0
                    // loop through sub square and remove all knights
                    // change toSubSqaure castle to invading player
                    // invadingKnights in toSubSqr = (fromKnights - 1) - toKnights
                    // if invadingKnights > 0 then
                    // allocate invadingKnights randomly in teritory
                    // if knightsFrom <= knightsTo then
                    // reduce knights in toSubSqr
                    // var reduceKnightsBy = knightsTo - knightsFrom
                    // loop through sub square and remove a knight until = reduceKnightsBy
                    // reduce knights in fromSubSqr
                    // knights in fromSubSqr = 0


                }
                else {
                    alert("attack not possible")
                }


                game.checkForAttack = false;
            }
            else {
                //alert("Select teritory to attack FROM");

                var subSqr = gridTiles.getSubSquare(row, column);
                var buildingToFind = "knight"
                var knights = gridTiles.whatsInSubsquare(subSqr, buildingToFind)
                //needs to be

                var playerInSubSquare = gridTiles.checkPlayerInSubSquare(subSqr.Row, subSqr.Col)
                game.currentPlayer.number
                //alert( "playerInSubSquare " + playerInSubSquare + " , Current Player " + game.currentPlayer.number );
                //alert("knights : " + knights );

                if ((knights > 0) && (playerInSubSquare)) {
                    alert("Please Select Territory to attack");
                    game.checkForAttackSubSqr = subSqr;
                    game.checkForAttack = true;
                    // sub square flashes (leave out for now)
                }
                else {
                    alert("Cannot attack from this teritory.");
                }

            }

        }

        draw();

    }// handle click


    //for prurposes of 9 x 9 grid scrolling not needed
    /*
    function handleKeyDown(e) {
        switch (e.keyCode) {
            case Keys.UP:
                scroll.y -= ((scroll.y - tile.height) >= 0) ? tile.height : 0;
                break;
            case Keys.DOWN:
                scroll.y += tile.height;
                break;
            case Keys.LEFT:
                scroll.x -= ((scroll.x - tile.width) >= 0) ? tile.width : 0;
                break;
            case Keys.RIGHT:
                scroll.x += tile.width;
                break;
        }
        document.getElementById('scrollx').innerHTML = scroll.x;
        document.getElementById('scrolly').innerHTML = scroll.y;
    }
    */



    //});
    //$(document).ready(function () { 





    function draw() {

        c.fillStyle = '#008000'; //fill entire grid with green
        c.fillRect(0, 0, canvas.width, canvas.height);
        //c.fillStyle = '#000000';

        var startRow = Math.floor(scroll.x / tile.width);
        var startCol = Math.floor(scroll.y / tile.height);
        var rowCount = startRow + Math.floor(canvas.width / tile.width) + 1;
        var colCount = startCol + Math.floor(canvas.height / tile.height) + 1;

        rowCount = ((startRow + rowCount) > grid.width) ? grid.width : rowCount;
        colCount = ((startCol + colCount) > grid.height) ? grid.height : colCount;

        var greenSquare = new Image();
        greenSquare.src = "img/greenSquare.png";
        c.drawImage(greenSquare, Math.round(0), Math.round(0), 96, 96);
        c.drawImage(greenSquare, Math.round(0), Math.round(96), 96, 96);
        c.drawImage(greenSquare, Math.round(0), Math.round(192), 96, 96);

        c.drawImage(greenSquare, Math.round(96), Math.round(0), 96, 96);
        c.drawImage(greenSquare, Math.round(96), Math.round(96), 96, 96);
        c.drawImage(greenSquare, Math.round(96), Math.round(192), 96, 96);

        c.drawImage(greenSquare, Math.round(192), Math.round(0), 96, 96);
        c.drawImage(greenSquare, Math.round(192), Math.round(96), 96, 96);
        c.drawImage(greenSquare, Math.round(192), Math.round(192), 96, 96);

        for (var row = startRow; row < rowCount; row++) {
            for (var col = startCol; col < colCount; col++) {

                var tilePositionX = tile.width * row;
                var tilePositionY = tile.height * col;
                tilePositionX -= scroll.x;
                tilePositionY -= scroll.y;

                if (gridTiles.tileMap[row] != null && gridTiles.tileMap[row][col] != null) {
                    if (gridTiles.tileMap[row][col].building == "farm") {
                        var farm = new Image();
                        farm.src = "img/farm.png";
                        c.drawImage(farm, Math.round(tilePositionX), Math.round(tilePositionY), farm.width, farm.height);

                        //Is The subsquare occupied by the current player
                        var subSquare = gridTiles.getSubSquare(row, col);
                        var player = gridTiles.tileMap[row][col].player;
                        gridTiles.colourPlayerColour(subSquare, player);
                    }

                    if (gridTiles.tileMap[row][col].building == "castle") {
                        var castle = new Image();
                        castle.src = "img/castle.png";
                        c.drawImage(castle, Math.round(tilePositionX), Math.round(tilePositionY), castle.width, castle.height);

                        //Is The subsquare occupied by the current player
                        var subSquare = gridTiles.getSubSquare(row, col);
                        var player = gridTiles.tileMap[row][col].player;
                        gridTiles.colourPlayerColour(subSquare, player);
                    }

                    if (gridTiles.tileMap[row][col].building == "knight") {
                        var knight = new Image();
                        knight.src = "img/knight.png";
                        c.drawImage(knight, Math.round(tilePositionX), Math.round(tilePositionY), knight.width, knight.height);

                        //Is The subsquare occupied by the current player
                        var subSquare = gridTiles.getSubSquare(row, col);
                        var player = gridTiles.tileMap[row][col].player;
                        gridTiles.colourPlayerColour(subSquare, player);
                        //alert("knight.width : " + knight.width, + ", knight.height : " + knight.height);
                    }
                }
            }
        }
        setTimeout(draw, 0.5);//used for real time applications
    }


});
