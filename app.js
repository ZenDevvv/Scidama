const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const redScoreBoard = document.querySelector(".red-score")
const blueScoreBoard = document.querySelector(".blue-score")
const width = 8

const pesoValue = 3


let playerGo = 'red'
let opponentGo = 'blue'
let correctGo
playerDisplay.textContent = 'red'

let blueScore = 0
let redScore = 0

const attackPiece = {type: '', value: 0}
const defendPiece = {type: '', value: 0}
const remainingPiece = {type: '', value: 0}


let bluePieceLeft = []
let redPieceLeft = []


let kingValidMoves = []
let kingUpLeftValidMoves = []
let kingUpRightValidMoves = []
let kingDownLeftValidMoves = []
let kingDownRightValidMoves = []

let upLeftSkipMoves = []
let upRightSkipMoves = []
let downLeftSkipMoves = []
let downRightSkipMoves = []
let normalValidMoves = []
let capturedUL = ''
let capturedUR = ''
let capturedDL = ''
let capturedDR = ''

let pieceJumping = ''

const upLimit = [56, 57, 58, 59, 60, 61, 62, 63]
const leftLimit = [7, 15, 23, 31, 39, 47, 55, 63]
const downLimit = [0, 1, 2, 3, 4, 5, 6, 7, 8]
const rightLimit = [0, 8, 16, 24, 32, 40, 48, 56]
let gameFinished = false

const startPieces = [
    bkwh3, '', bp6, '', bkwh9, '', bp12, '', 
    '', bp8, '', bkwh11, '', bp4, '', bkwh1, 
    bkwh5, '', bp2, '', bkwh7, '', bp10, '', 
    '', '', '', '', '', '', '', '', 
    '', '', '', '', '', '', '', '', 
    '', rp10, '', rkwh7, '', rp2, '', rkwh5, 
    rkwh1, '', rp4, '', rkwh11, '', rp8, '', 
    '', rp12, '', rkwh9, '', rp6, '', rkwh3, 
]


const operator = [
    'multiply', '', 'divide','', 'subtract','', 'add','',
    '', 'divide','', 'multiply', '','add','', 'subtract',
    'subtract', '', 'add', '', 'multiply', '', 'divide','',
    '', 'add', '', 'subtract', '', 'divide','', 'multiply',
    'multiply', '', 'divide','', 'subtract','', 'add','',
    '', 'divide','', 'multiply', '','add','', 'subtract',
    'subtract', '', 'add', '', 'multiply', '', 'divide','',
    '', 'add', '', 'subtract', '', 'divide','', 'multiply'
]


function createBoard() {
    startPieces.forEach((startPieces, i) => {
        const square = document.createElement('div')
        square.classList.add('square')
        square.setAttribute('square-id', i)

        const row = Math.floor( (63 - i) / 8) + 1
        if( row % 2 === 0){
            square.classList.add(i % 2 === 0 ? "white" : "green")
        } else {
            square.classList.add(i % 2 === 0 ? "green" : "white")
        }



        // -----------------adding piece---------------------------
        square.innerHTML = startPieces
        square.firstChild?.setAttribute('draggable', true)
        if ( i <= 23){
            if(square.firstChild){
                square.firstChild.firstChild.classList.add("blue")
                bluePieceLeft.push(square.firstChild)
            }
        }
        if ( i >= 40){
            if(square.firstChild){
                square.firstChild.firstChild.classList.add("red")
                redPieceLeft.push(square.firstChild)
            }
        }


        // --------------------adding operator on the board ---------------------------
        const op = operator[i]
        if (op) {
            square.classList.add(op);
        }





        gameBoard.append(square)
    })
}
createBoard()
reverseIds()

let obligadoKaon = []
let startPositionId
let draggedElement
let eatingElement
gameState()





function gameState(){
    obligadoKaon = []
    clear()
    const gameBoardSquares = document.querySelectorAll('.square');
    gameBoardSquares.forEach(square => {


///--------------------------------------Searching for obligado kaon pieces--------------------------
        if(square.firstChild){
            handleDragStart(square.firstChild)
            const isKing = square.firstChild.classList.contains('king')

            if(ifPlayersTurn(square)){
                if(isKing){
                    let canCapture = checkKingValidMoves(correctGo)
                    if (pieceJumping){
                        obligadoKaon.push(pieceJumping)
                    } else if(canCapture){
                        obligadoKaon.push(square.firstChild)
                    }
                }else{
                    const isCaptureValid = validCaptures()
                    if (pieceJumping){
                        obligadoKaon.push(pieceJumping)
                    } else if(isCaptureValid){
                        obligadoKaon.push(square.firstChild)
                    }
                }
            }
        }

    });
}

function ifPlayersTurn(target){
    if(target.firstChild.firstChild.classList.contains(playerGo)){
        return true
    }
}




function touchStart(e){
    console.log(e.target)
    handleDragStart(e.target)

    clear()
    const isKing = e.target.classList.contains('king')

    if(obligadoKaon.length){
        if(obligadoKaon.includes(e.target)){
            getPieceValue(draggedElement, attackPiece)

            redToNormal()
            handleDragStart(e.target)

            if(isKing){
                checkKingValidMoves(correctGo)
                drawKingValidMoves()

            }else{
                validCaptures()
                drawNormalValidMoves()
            }
        }else{
            drawObligadoKaon()
            invalidMove()
    
        }
    }else{
        handleDragStart(e.target)
        
        if(e.target.firstChild.classList.contains(playerGo)){
            if(isKing){
                checkKingValidMoves(correctGo)
                drawKingValidMoves()
            }else{
                checkIfValidMove()
                drawNormalValidMoves()

            }

        }else{
            //shake the board
        }
    } 
}


function touchend(e){
    console.log(e)
}

function touchmove(e){
    // console.log(e)
}




const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    square.addEventListener('touchstart', touchStart)

    // square.addEventListener('drag', whileDrag)
    // square.addEventListener('dragend', dragEnd)

    square.addEventListener('dragover', dragOver)
    square.addEventListener('touchmove', touchmove)

    square.addEventListener('drop', dragDrop)
    square.addEventListener('touchend', touchend)

    square.addEventListener('mouseover', mouseOver)
    square.addEventListener('mouseout', mouseOut)
    square.addEventListener('click', mouseClick)
})

function transparentize(e){
    e.target.style.opacity = 1
}


function mouseClick(e){
    if(e.target.classList.contains('piece')){
        
        setTimeout(() => transparentize(e), 2000)
        e.target.style.opacity = .5
//  --------  all piece becomes king (for testing only. comment this out)----
        // const kingImage = document.createElement('img');
        // kingImage.src = 'assets/crown.png'; 
        // kingImage.classList.add('king-image');
        // e.target.classList.add('king')
        // e.target.appendChild(kingImage);
// -------------------------------------------------------------------------
    }
}


function mouseOver(e){
    if(e.target.firstChild && ifPlayersTurn(e.target.parentNode)){
        e.target.parentNode.classList.add('yellow')
    }
}

function mouseOut(e){
    if(e.target.firstChild && ifPlayersTurn(e.target.parentNode)){
        e.target.parentNode.classList.remove('yellow')
    }
    

}


function handleDragStart(target){
    startPositionId = Number(target.parentNode.getAttribute('square-id'))
    draggedElement = target
    eatingElement = draggedElement.parentNode
    correctGo = target.firstChild.classList.contains(playerGo)
}

function drawObligadoKaon(){
    obligadoKaon.forEach(square => {
        square.parentNode.classList.add('red')
    })
}

function drawNormalValidMoves(){
    normalValidMoves.forEach(square => {
        square.classList.add('yellow')
    })
}

function drawKingValidMoves(){
    kingValidMoves.forEach(square => {
        square.classList.add('yellow')
    })
}

function invalidMove(){
    infoDisplay.textContent = 'Invalid Move!'
    setTimeout(() => infoDisplay.textContent = "", 2000)
}


// let initialX = 0;
// let initialY = 0;

function dragStart (e) {
    if(gameFinished){
        location.reload();
    }
    draggedElement = e.target;
    e.dataTransfer.setDragImage(draggedElement, 37,37);
    

    clear()
    const isKing = e.target.classList.contains('king')

    if(obligadoKaon.length){
        if(obligadoKaon.includes(e.target)){
            getPieceValue(draggedElement, attackPiece)

            redToNormal()
            handleDragStart(e.target)

            if(isKing){
                checkKingValidMoves(correctGo)
                drawKingValidMoves()

            }else{
                validCaptures()
                drawNormalValidMoves()
            }
        }else{
            playSoundEffect('move-illegal001')
            drawObligadoKaon()
            invalidMove()
            // setTimeout(() => redToNormal(), 3000)
            // window.alert('Obligado kaon')
        }
    }else{
        handleDragStart(e.target)
        
        if(e.target.firstChild.classList.contains(playerGo)){
            if(isKing){
                checkKingValidMoves(correctGo)
                drawKingValidMoves()
            }else{
                checkIfValidMove()
                drawNormalValidMoves()
            }

        }else{
            //shake the board
        }
    }   
}

function dragOver (e){
    e.preventDefault()    
}

function dragDrop (e) {

    e.stopPropagation()

    yellowToNormal()
    handleDropDrag(e) 
    gameState() 
    clear() 
}
    


function redToNormal(){
    const rer = document.querySelectorAll('.square.red')
    rer.forEach(squares => {
        squares.classList.remove('red')
    })
}

function yellowToNormal(){
    const yel = document.querySelectorAll('.square.yellow')
    yel.forEach(squares => {
        squares.classList.remove('yellow')
    })
}



function handleDropDrag(e){
    const kingsRow = [56, 57, 58, 59, 60 ,61, 62, 63]
    const isKing = draggedElement.classList.contains('king');

    const targetId = e.target.hasAttribute('square-id')
    ? Number(e.target.getAttribute('square-id')) // Get e.target's square-id
    : e.target.parentNode.hasAttribute('square-id')
    ? Number(e.target.parentNode.getAttribute('square-id')) // Get parent node's square-id
    : null; // If neither e.target nor its parent has a square-id, set targetId to null or another default value


    ///// -----------------------------------King piece---------------------------------------
    if(isKing){ 
        let canCapture
        
        if(kingValidMoves.includes(e.target) && correctGo){
            pieceJumping = draggedElement

            if(capturedUL || capturedUR || capturedDL || capturedDR){
                playSoundEffect('move-kingattack001')
                if(capturedUL && kingUpLeftValidMoves.includes(e.target)){
                    capturedPieces.push(capturedUL)
                    removePiece(capturedUL)
                }else if(capturedUR && kingUpRightValidMoves.includes(e.target)){
                    capturedPieces.push(capturedUR)
                    removePiece(capturedUR)
                }else if(capturedDL && kingDownLeftValidMoves.includes(e.target)){
                    capturedPieces.push(capturedDL)
                    removePiece(capturedDL)
                }else if(capturedDR && kingDownRightValidMoves.includes(e.target)){
                    capturedPieces.push(capturedDR)
                    removePiece(capturedDR)
                }
            }else{
                playSoundEffect('move-king001')
            }

            calculatePoints(e.target)
            e.target.append(draggedElement)
            eatingElement = draggedElement.parentNode

            canCapture = checkKingValidMoves(e.target, correctGo)

            if(!capturedPieces.length){
                clear()
                changePlayer()
            }else{
                if(!canCapture){
                    clear()
                    changePlayer()
                }
            }
        }
    //// ------------------------------------normal piece---------------------------------------
    } else { 
        const isCaptureValid = validCaptures()

        if(isCaptureValid) {
            if(normalValidMoves.includes(e.target)){
                playSoundEffect('move-attack001')
                if(upLeftSkipMoves.includes(e.target)){
                    e.target.append(draggedElement)
                    removePiece(capturedUL.firstChild)
                    pieceJumping = draggedElement
                } else if (upRightSkipMoves.includes(e.target)){
                    e.target.append(draggedElement)
                    removePiece(capturedUR.firstChild)
                    pieceJumping = draggedElement
                }else if(downLeftSkipMoves.includes(e.target)){
                    e.target.append(draggedElement)
                    removePiece(capturedDL.firstChild)
                    pieceJumping = draggedElement
                } else if(downRightSkipMoves.includes(e.target)){
                    e.target.append(draggedElement)
                    removePiece(capturedDR.firstChild)
                    pieceJumping = draggedElement
                }
            }
            
            calculatePoints(e.target)
            startPositionId = Number(e.target.getAttribute('square-id'))
            const isCaptureValid = validCaptures()
            if(!isCaptureValid){
                if(kingsRow.includes(targetId)){
                    makeKing(e.target)
                }
                if((upLeftSkipMoves.includes(e.target) || upRightSkipMoves.includes(e.target) || downLeftSkipMoves.includes(e.target) || downRightSkipMoves.includes(e.target))) {
                    changePlayer()
                    clear()
                }
            }

            

        } else {
            clear()
            const valid = checkIfValidMove()
            if (valid && correctGo && normalValidMoves.includes(e.target)) {
                
                playSoundEffect('move-normal001')
                e.target.append(draggedElement)
                e.target.getAttribute('square-id')
                changePlayer()
                clear()

                if(kingsRow.includes(targetId)){
                    makeKing(e.target)
                }
            }
        }
    }


//----------------------------------------------WIN CONDITION------------------------
    if(bluePieceLeft.length == 0 || redPieceLeft.length == 0){
        playSoundEffect('endgame_win001')
        winCondition()
    }
}

function calculateRemainingPiece(){
    let score
    if(remainingPiece.type === 'kwh'){
        score = remainingPiece.value*pesoValue
    }else{
        score = remainingPiece.value
    }
    return score
}

function winCondition(){
    let result = 0
    if(bluePieceLeft.length == 0){
        redPieceLeft.forEach(piece => {
            getPieceValue(piece, remainingPiece)
            result += calculateRemainingPiece()
            console.log(result,piece.getAttribute('id'))
        })
    }else{
        bluePieceLeft.forEach(piece => {
            getPieceValue(piece, remainingPiece)
            result += calculateRemainingPiece()
            console.log(result,piece.getAttribute('id'))
        })
    }
    changePlayer()
    updateScoreBoard(result)
    
    setTimeout(() => showWin(), 1000)
}


function showWin(){
    if(redScore < blueScore){
        window.alert('RED WINS!')
    }else if(redScore > blueScore){
        window.alert('BLUE WINS!')
    }else{
        window.alert('DRAW DRAW DRAW is this even possible?')
    }
    gameFinished = true
}

function removeFromArray(array, toRemove){
    const newArray = array.filter(item => item != toRemove)
    return newArray
}


function removePiece(piece){
    getPieceValue(piece, defendPiece)
    piece.remove()
    if(opponentGo == 'blue'){
        bluePieceLeft = removeFromArray(bluePieceLeft, piece)
    }else{
        redPieceLeft = removeFromArray(redPieceLeft, piece)
    }
}


///----------------------Valid captured for Normal pieces ----------------------------
function validCaptures(){
    const upleft = checkUpLeft()
    const upright = checkUpRight()
    const downleft = checkDownLeft()
    const downright = checkDownRight()

    if(upleft || upright || downleft || downright){
        return true
    }else{
        return false
    }

}


function checkUpLeft(){
    const upleft = document.querySelector(`[square-id="${startPositionId + width + 1}"]`);
    const upleftSkip = document.querySelector(`[square-id="${startPositionId + (width*2) + 2}"]`);

    if (upleft && upleft.firstChild && upleft.firstChild.firstChild) {
        const upleftId = Number(upleft.getAttribute('square-id'))
        if (upleft.firstChild.firstChild.classList.contains(opponentGo) && 
            draggedElement.firstChild.classList.contains(playerGo) && 
            !upLimit.includes(upleftId) && !leftLimit.includes(upleftId) &&
            !upleftSkip.firstChild) {

            upLeftSkipMoves.push(upleftSkip);
            normalValidMoves.push(upleftSkip)
            capturedUL = upleft
                                        // The 'upleft' square has a child with class 'opponentGo'.
            return true
        } else {
            // The 'upleft' square has a child, but it's not of class 'opponentGo'.
            return false
        }
    } else {
        // The 'upleft' square doesn't have the required structure.
        return false
    }
}

function checkUpRight() {
    const upright = document.querySelector(`[square-id="${startPositionId + width - 1}"]`);
    const uprightSkip = document.querySelector(`[square-id="${startPositionId + (width*2) - 2}"]`);

    if (upright && upright.firstChild && upright.firstChild.firstChild) {
        const uprightId = Number(upright.getAttribute('square-id'))
        if (upright.firstChild.firstChild.classList.contains(opponentGo) && 
            draggedElement.firstChild.classList.contains(playerGo) &&
            !upLimit.includes(uprightId) && !rightLimit.includes(uprightId) &&
            !uprightSkip.firstChild) {

            upRightSkipMoves.push(uprightSkip);
            normalValidMoves.push(uprightSkip)
            capturedUR = upright
                                     // The 'upleft' square has a child with class 'opponentGo'.
            return true
        } else {
            // The 'upleft' square has a child, but it's not of class 'opponentGo'.
            return false
        }
    } else {
        // The 'upleft' square doesn't have the required structure.
        return false
    }
}

function checkDownLeft() {
    const downleft = document.querySelector(`[square-id="${startPositionId - width + 1}"]`);
    const downleftSkip = document.querySelector(`[square-id="${startPositionId - (width*2) + 2}"]`);

    if (downleft && downleft.firstChild && downleft.firstChild.firstChild) {
        const downleftId = Number(downleft.getAttribute('square-id'))
        if (downleft.firstChild.firstChild.classList.contains(opponentGo) && 
            draggedElement.firstChild.classList.contains(playerGo) &&
            !downLimit.includes(downleftId) && !leftLimit.includes(downleftId) &&
            !downleftSkip.firstChild) {

            downLeftSkipMoves.push(downleftSkip);
            normalValidMoves.push(downleftSkip)

            capturedDL = downleft
                                        // The 'upleft' square has a child with class 'opponentGo'.
            return true
        } else {
            // The 'upleft' square has a child, but it's not of class 'opponentGo'.
            return false
        }
    } else {
        // The 'upleft' square doesn't have the required structure.
        return false
    }

}

function checkDownRight() {
    const downright = document.querySelector(`[square-id="${startPositionId - width - 1}"]`);
    const downrightSkip = document.querySelector(`[square-id="${startPositionId - (width*2) - 2}"]`);

    if (downright && downright.firstChild && downright.firstChild.firstChild) {
        const downrightId = Number(downright.getAttribute('square-id'))
        if (downright.firstChild.firstChild.classList.contains(opponentGo) && 
            draggedElement.firstChild.classList.contains(playerGo) &&
            !downLimit.includes(downrightId) && !rightLimit.includes(downrightId) &&
            !downrightSkip.firstChild) {

            downRightSkipMoves.push(downrightSkip);
            normalValidMoves.push(downrightSkip)

            capturedDR = downright
                                            // The 'upleft' square has a child with class 'opponentGo'.
            return true
        } else {
            // The 'upleft' square has a child, but it's not of class 'opponentGo'.
            return false
        }
    } else {
        // The 'upleft' square doesn't have the required structure.
        return false
    }
}


///------------------------------check Valid moves for non-captured normal pieces --------------------------
function checkIfValidMove() {
    const startId = startPositionId
    const upleft = document.querySelector(`[square-id="${startId + width + 1}"]`)
    const upright = document.querySelector(`[square-id="${startId + width - 1}"]`)

    if(!upleft.firstChild || !upright.firstChild){
        if (!upleft.firstChild && !leftLimit.includes(startPositionId)){
            normalValidMoves.push(upleft) 
        }
        if(!upright.firstChild && !rightLimit.includes(startPositionId)){
            normalValidMoves.push(upright)
        }
        return true
    }  
 
}


function squareOnUpLeftLimit(square){
    if(leftLimit.includes(Number(square.getAttribute('square-id'))) ||
    upLimit.includes(Number(square.getAttribute('square-id')))){
        return true
    }else{
        return false
    }
}

function squareOnUpRightLimit(square){
    if(rightLimit.includes(Number(square.getAttribute('square-id'))) ||
    upLimit.includes(Number(square.getAttribute('square-id')))){
        return true
    }else{
        return false
    }
}

function squareOnDownLeftLimit(square){
    if(leftLimit.includes(Number(square.getAttribute('square-id'))) ||
    downLimit.includes(Number(square.getAttribute('square-id')))){
        return true
    }else{
        return false
    }
}

function squareOnDownRightLimit(square){
    if(rightLimit.includes(Number(square.getAttribute('square-id'))) ||
    downLimit.includes(Number(square.getAttribute('square-id')))){
        return true
    }else{
        return false
    }
}




////--------------------------------------------CHECK KING VALID MOVES------------------
function checkKingValidMoves(correctGo){
    const state1 = checkKingValidMoveUpLeft(correctGo)
    const state2 = checkKingValidMoveUpRight(correctGo)
    const state3 = checkKingValidMoveDownLeft(correctGo)
    const state4 = checkKingValidMoveDownRight(correctGo)

    if(state1 || state2 || state3 || state4){
        kingValidMoves = []
        if (state1){
            eatingElement = state1
            capturedUL = state1.firstChild
            checkKingValidMoveUpLeft(correctGo)
        }
        if (state2){
            eatingElement = state2
           capturedUR = state2.firstChild
            checkKingValidMoveUpRight(correctGo)
        }
        if (state3){
            eatingElement = state3
            capturedDL = state3.firstChild
            checkKingValidMoveDownLeft(correctGo)
        }
        if (state4){
            eatingElement = state4
            capturedDR = state4.firstChild
            checkKingValidMoveDownRight(correctGo)
        }
        return true
    }
    return false
}

function checkComboKingUpLeft(correctGo){
    let skip

    do{
        let skip = getSkipSquareUpLeft(eatingElement)
        eatingElement = skip
        if(checkKingValidMoveDownLeft(correctGo)){
            kingValidMoves.push(skip)
        }else if(checkKingValidMoveUpRight){
            kingValidMoves.push(skip)
        }
    }while(!skip.firstChild && !squareOnUpLeftLimit(skip))
}

function checkKingValidMoveUpLeft(correctGo) {    
    // -----------------------------------------------checks upper left moves of a king--------------------
    let kingSquare = eatingElement  //<----- BUG
    if(correctGo){
        let skip = kingSquare

        do{
            skip = getSkipSquareUpLeft(skip)

            if(squareOnUpLeftLimit(kingSquare)){
                break
            }else if(!skip.firstChild){
                kingValidMoves.push(skip)
                kingUpLeftValidMoves.push(skip)
                
            } else if(skip.firstChild.firstChild.classList.contains(opponentGo)  && !squareOnUpLeftLimit(skip) &&!getSkipSquareUpLeft(skip).firstChild) {
                return skip
            }
            
        }while(!skip.firstChild && !squareOnUpLeftLimit(skip))
    }
    return false
}

function getSkipSquareUpLeft(kingSquare) {
    let kingSquareId = Number(kingSquare.getAttribute('square-id'))
    let skipKingSquare = document.querySelector(`[square-id="${kingSquareId + width + 1}"]`)
    return skipKingSquare
}


// -----------------------------------------------checks upper right moves of a king--------------------
function checkKingValidMoveUpRight(correctGo) {
    let kingSquare = eatingElement
    if(correctGo){
        let skip = kingSquare

        do{
            skip = getSkipSquareUpRight(skip)
            if(squareOnUpRightLimit(kingSquare)){
                break
            }
            else if(!skip.firstChild){
                kingValidMoves.push(skip)
                kingUpRightValidMoves.push(skip)
            }else if(skip.firstChild.firstChild.classList.contains(opponentGo) && !squareOnUpRightLimit(skip) && !getSkipSquareUpRight(skip).firstChild) {
                return skip
            }
        } while(!skip.firstChild && !squareOnUpRightLimit(skip))
    }
}

function getSkipSquareUpRight(kingSquare) {
    let kingSquareId = Number(kingSquare.getAttribute('square-id'))
    let skipKingSquare = document.querySelector(`[square-id="${kingSquareId + width - 1}"]`)
    return skipKingSquare
}


// -----------------------------------------------checks down left moves of a king--------------------
function checkKingValidMoveDownLeft(correctGo) {
    let kingSquare = eatingElement
    if(correctGo){
        let skip = kingSquare

        do{
            skip = getSkipSquareDownLeft(skip)
            if(squareOnDownLeftLimit(kingSquare)){
                break
            }
            else if(!skip.firstChild){
                kingValidMoves.push(skip)
                kingDownLeftValidMoves.push(skip)
            }else if(skip.firstChild.firstChild.classList.contains(opponentGo) && !squareOnDownLeftLimit(skip) &&!getSkipSquareDownLeft(skip).firstChild) {
                return skip
            }
        } while(!skip.firstChild && !squareOnDownLeftLimit(skip))
    }
}

function getSkipSquareDownLeft(kingSquare) {
    let kingSquareId = Number(kingSquare.getAttribute('square-id'))
    let skipKingSquare = document.querySelector(`[square-id="${kingSquareId - width + 1}"]`)
    return skipKingSquare
}


// -----------------------------------------------checks down right moves of a king--------------------
function checkKingValidMoveDownRight(correctGo) {
    let kingSquare = eatingElement
    if(correctGo){
        let skip = kingSquare

        do{
            skip = getSkipSquareDownRight(skip)
            if(squareOnDownRightLimit(kingSquare)){
                break
            }
            else if(!skip.firstChild){
                kingValidMoves.push(skip)
                kingDownRightValidMoves.push(skip)
            }else if(skip.firstChild.firstChild.classList.contains(opponentGo) && !squareOnDownRightLimit(skip) &&!getSkipSquareDownRight(skip).firstChild) {
                return skip
            }
        }while(!skip.firstChild && !squareOnDownRightLimit(skip))
    }
}

function getSkipSquareDownRight(kingSquare) {
    let kingSquareId = Number(kingSquare.getAttribute('square-id'))
    let skipKingSquare = document.querySelector(`[square-id="${kingSquareId - width - 1}"]`)
    return skipKingSquare
}


 

function changePlayer() {
    pieceJumping = ''
    if(playerGo === 'blue'){
        reverseIds()        
        playerGo = 'red'
        opponentGo = 'blue'
        playerDisplay.textContent = 'red'
        gameboard.style.borderColor = "#9C090C";
    }else{
        revertIds()
        playerGo = 'blue'
        opponentGo = 'red'
        playerDisplay.textContent = 'blue'
        gameboard.style.borderColor = "#006791";
    }
}

function reverseIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => 
        square.setAttribute('square-id', (width * width -1)-i))
}

function revertIds() {
    const allSquares = document.querySelectorAll(".square")
    allSquares.forEach((square, i) => square.setAttribute('square-id', i))
}

function clear(){
    upLeftSkipMoves = []
    upRightSkipMoves = []
    downLeftSkipMoves = []
    downRightSkipMoves = []
    normalValidMoves = [] 
    capturedUL = ''
    capturedUR = ''
    capturedDL = ''
    capturedDR = ''
    capturedPieces = []
    kingValidMoves = []
    kingUpLeftValidMoves = []
    kingUpRightValidMoves = []
    kingDownLeftValidMoves = []
    kingDownRightValidMoves = []
    attackPiece.type = ''
    defendPiece.value = 0
}

function makeKing(target) {
    playSoundEffect('move-promotion001')
    const kingImage = document.createElement('img');
    kingImage.src = 'assets/crown.png'; // Set the path to your crown image
    kingImage.classList.add('king-image');
  
    target.firstChild.classList.add('king')
    target.firstChild.appendChild(kingImage);
}


function updateScoreBoard(result){
    if(playerGo === 'red'){
        console.log('Red Scoreboard:',redScore,'+',result,'=', redScore+result,'\n\n----------------------------')
        redScore += result
        redScoreBoard.textContent = redScore
    }else{
        console.log('Blue Scoreboard:',blueScore,'+',result,'=', blueScore+result,'\n\n----------------------------')
        blueScore += result
        blueScoreBoard.textContent = blueScore
    }
}

function logHistory(){

}


function calculatePoints(target){
    if(ifSamePieceType()){
        if(target.classList.contains('add')){
            result = attackPiece.value + defendPiece.value
            console.log(attackPiece.type,attackPiece.value ,'+', defendPiece.type,defendPiece.value ,'=', result)
            if(draggedElement.classList.contains('king')){
                console.log('King piece',result,'*',2,'=',result*2)
                result *= 2
            }
            if(attackPiece.type === 'kwh'){
                console.log('kwh convert to Peso ',result,'*',pesoValue, '=', result*pesoValue)
                result*=pesoValue
            }
            updateScoreBoard(result)
        } else if(target.classList.contains('subtract')){
            result = attackPiece.value - defendPiece.value
            if(!(result < 0)) {
                console.log(attackPiece.type,attackPiece.value ,'-', defendPiece.type,defendPiece.value ,'=', result)
                if(draggedElement.classList.contains('king')){
                    console.log('King piece',result,'*',2,'=',result*2)
                    result *= 2
                }
                if(attackPiece.type === 'kwh'){
                    console.log('kwh convert to Peso ',result,'*',pesoValue, '=', result*pesoValue)
                    result*=pesoValue
                }
            }else{
                result = 0
                console.log(attackPiece.type,attackPiece.value ,'-', defendPiece.type,defendPiece.value ,'= No score')
            }
            updateScoreBoard(result)
        }else if(target.classList.contains('multiply')){
            console.log(attackPiece.type,attackPiece.value ,'*', defendPiece.type,defendPiece.value ,'= No score\n\n----------------------------')
        }else if(target.classList.contains('divide')){
            result = attackPiece.value / defendPiece.value
            console.log(attackPiece.type,attackPiece.value ,'/', defendPiece.type,defendPiece.value ,'= No score\n\n----------------------------')
        }
    }else{
        console.log(attackPiece.type,attackPiece.value ,'+', defendPiece.type,defendPiece.value,'=','No score\n\n----------------------------')
    }
}

function ifSamePieceType(){
    if(attackPiece.type === defendPiece.type){
        return true
    }
}


function ifElementIdInBlue(id){
    const isit = ['bkwh3', 'bp6', 'bkwh9', 'bp12', 'bp8', 'bkwh11', 'bp4', 'bkwh1', 'bkwh5', 'bp2', 'bkwh7', 'bp10'].includes(id)
    // console.log(isit)
    return isit

}


function getPieceValue(target, pieceToUpdate){
    elementId = target.getAttribute('id')
    // console.log(elementId)

    if(ifElementIdInBlue(elementId)){
        switch(elementId){
            case 'bkwh3':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 3
                break;
            
            case 'bp6':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 6
                break;

            case 'bkwh9':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 9
                break;
            
            case 'bp12':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 12
                break;      
                
            case 'bp8':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 8
                break;

            case 'bkwh11':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 11
                break;

            case 'bp4':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 4
                break;

            case 'bkwh1':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 1
                break;

            case 'bkwh5':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 5
                break;

            case 'bp2':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 2
                break;

            case 'bkwh7':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 7
                break;

            case 'bp10':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 10
                break;
        }   

    }else{
        switch(elementId){
            case 'rkwh3':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 3
                break;
            
            case 'rp6':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 6
                break;

            case 'rkwh9':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 9
                break;
            
            case 'rp12':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 12
                break;      
                
            case 'rp8':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 8
                break;

            case 'rkwh11':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 11
                break;

            case 'rp4':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 4
                break;

            case 'rkwh1':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 1
                break;

            case 'rkwh5':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 5
                break;

            case 'rp2':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 2
                break;

            case 'rkwh7':
                pieceToUpdate.type = 'kwh'
                pieceToUpdate.value = 7
                break;

            case 'rp10':
                pieceToUpdate.type = 'P'
                pieceToUpdate.value = 10
                break;
        }   
    }
}


function playSoundEffect(soundEffectId){
    const soundEffect = document.getElementById(soundEffectId)
    soundEffect.play()
}
