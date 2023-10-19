const gameBoard = document.querySelector("#gameboard")
const playerDisplay = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const width = 8
let playerGo = 'red'
let opponentGo = 'blue'
let correctGo
playerDisplay.textContent = 'red'




let eatenBluePiece = []
let eatenRedPiece = []


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
            }
        }
        if ( i >= 40){
            if(square.firstChild){
                square.firstChild.firstChild.classList.add("red")
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
                        // console.log('cap')
                    }
                }
            }
        }

        // if(square.firstChild){ 
        //     square.addEventListener('click', function() {
                
        //         clear()
        //         if(square.firstChild && square.firstChild.firstChild.classList.contains(playerGo)){
        //             console.log(square)  
        //             handleDragStart(square.firstChild)
        //             const isKing = square.firstChild.classList.contains('king')
        //             if(isKing){
        //                 checkKingValidMoves(correctGo)
        //                 console.log(kingValidMoves)

    });
}

function ifPlayersTurn(target){
    if(target.firstChild.firstChild.classList.contains(playerGo)){
        return true
    }
}


const allSquares = document.querySelectorAll(".square")

allSquares.forEach(square => {
    square.addEventListener('dragstart', dragStart)
    // square.addEventListener('drag', whileDrag)
    // square.addEventListener('dragend', dragEnd)

    square.addEventListener('dragover', dragOver)
    square.addEventListener('drop', dragDrop)
    square.addEventListener('mouseover', mouseOver)
    square.addEventListener('mouseout', mouseOut)
    square.addEventListener('click', mouseClick)
})


// function whileDrag(e){
//     if (draggedElement) {
//         // Update the element's position to follow the cursor
//         draggedElement.style.display = 'block';
//         draggedElement.style.position = 'fixed';
//         draggedElement.style.left = e.clientX + 'px';
//         draggedElement.style.top = e.clientY + 'px';
//     }
// }

// function dragEnd(e){
//     if (draggedElement) {
//         draggedElement.style.position = 'static';
//         draggedElement.style.left = '';
//         draggedElement.style.top = '';
//         draggedElement.style.display = 'block';
//         draggedElement = null;
//     }
// }


function mouseClick(e){
    if(e.target.classList.contains('piece')){
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
    eatingElement = draggedElement
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


let initialX = 0;
let initialY = 0;

function dragStart (e) {
    draggedElement = e.target;
    

    clear()
    const isKing = e.target.classList.contains('king')

    if(obligadoKaon.length){
        if(obligadoKaon.includes(e.target)){
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
        
        canCapture = checkKingValidMoves(correctGo)
        if(kingValidMoves.includes(e.target) && correctGo){
            pieceJumping = draggedElement
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
            e.target.append(draggedElement)
            eatingElement = draggedElement
            
            
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

            console.log(pieceJumping)
            
            
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

    if(eatenBluePiece.length == 12){
        window.alert('Red wins!\nWew Galinga Red Oy Mura Mag WTF')
    }
    else if(eatenRedPiece.length == 12){
        window.alert('Blue wins!\nWew Galinga Blue Oy Mura Mag WTF')
    }
}


function removePiece(piece){
    if(opponentGo == 'blue'){
        eatenBluePiece.push(piece)
    }else{
        eatenRedPiece.push(piece)
    }
    piece.remove()
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
            capturedUL = eatingElement = state1.firstChild
            checkKingValidMoveUpLeft(correctGo)
        }
        if (state2){
            capturedUR = eatingElement = state2.firstChild
            checkKingValidMoveUpRight(correctGo)
        }
        if (state3){
            capturedDL = eatingElement = state3.firstChild
            checkKingValidMoveDownLeft(correctGo)
        }
        if (state4){
            capturedDR = eatingElement = state4.firstChild
            checkKingValidMoveDownRight(correctGo)
        }
    
        return true
    }
    return false
}

function checkKingValidMoveUpLeft(correctGo) {    
    // -----------------------------------------------checks upper left moves of a king--------------------
    let kingSquare = eatingElement.parentNode   //<----- BUG
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
    let kingSquare = eatingElement.parentNode
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
    let kingSquare = eatingElement.parentNode
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
    let kingSquare = eatingElement.parentNode
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
}

function makeKing(target) {
    const kingImage = document.createElement('img');
    kingImage.src = 'assets/crown.png'; // Set the path to your crown image
    kingImage.classList.add('king-image');
  
    target.firstChild.classList.add('king')
    target.firstChild.appendChild(kingImage);
}
