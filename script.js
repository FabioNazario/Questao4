
//CONFIGURATION
const LAND 		  = 2;
const WATER 	  = 1;
const AIR 	      = 0;
const LAND_COLOR  = 'brown';
const WATER_COLOR = 'blue';
const AIR_COLOR   = 'white';

const COLOR_MAP      = [ AIR_COLOR
                        ,WATER_COLOR
                        ,LAND_COLOR   ];

async function execute(){
	
	PIXEL_SIZE    		= document.getElementById('pixel_size').value;;                     
	WATER_LINES_ABOVE 	= document.getElementById('water_lines').value;
	FREE_LINES_BETWEEN	= document.getElementById('free_lines').value;
	DELAY 				= document.getElementById('delay').value;
	map = [];

	input = document.getElementById('input').value;
	
	input = parseInputMapToInt(input.split(','));

	if (input.length >= 3){

		map = landArrayToMap(input)
	    map = putLinesAbove(map);
	    renderMap(map);
	    isChanged = true;
		
	    while(isChanged){
			await sleep(DELAY);
			map = waterFall(map)
			renderMap(map);
			//console.log(quantidadeDeAgua(map));
	    }
	}else{
		alert('No mínimo 3 elementos');
	}
   
}

function renderMap(map){
	const screen = document.getElementById('screen');
	const context = screen.getContext('2d');

	//0 = nothing
	//1 = land
	//2 = water
    
	const width  = PIXEL_SIZE * map[0].length;
	const height = PIXEL_SIZE * map.length;

	screen.setAttribute('width',width);
	screen.setAttribute('height',height);
    
	for(y=0; y<map.length;y++){
		for(x=0; x<map[0].length;x++){
					
			context.fillStyle = COLOR_MAP[map[y][x]];
			context.fillRect(x*PIXEL_SIZE, y*PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
		}
	}
}


function landArrayToMap(landArray){
	
	map = [];
	line = [];
	higherLand = getHigherLand(landArray);

	for (i = 0; i<higherLand ; i++){
		for (j = 0; j<landArray.length; j++){
			if (landArray[j] > 0){
				line.push(LAND);
				landArray[j]--;
			}else{
				line.push(AIR);
			}
			 
		}
		map.unshift(line);
		line=[];
	}
	return map;

}

function putLinesAbove(map){

	for (i = 0; i<WATER_LINES_ABOVE; i++){
		map.unshift(Array(map[0].length).fill(WATER));
	}
	for (i = 0; i<FREE_LINES_BETWEEN; i++){
		map.unshift(Array(map[0].length).fill(AIR));
	}
	return map;
}

function getHigherLand(landArray){
	max = 0;

	for (i = 0; i<landArray.length; i++){
		if (landArray[i] > max){
			max = landArray[i];
		}
	}
	return max;
}

function waterFall(map){
	let i = 0;
	isChanged = false
	for(let y=map.length-1; y>0;y--){
		for(let x=0; x<map[0].length;x++){

			up_square      = map[y-1][x];
			current_square = map[y][x];
			right_square   = map[y][x+1];
			left_square    = map[y][x-1];

			if (current_square == AIR && up_square == WATER){

				current_square = up_square;
				up_square = AIR;
				isChanged = true;

			}else if(    current_square != AIR 
					 && up_square == WATER 
					 && left_square != AIR
					 && right_square == AIR){
				up_square = AIR;
			    right_square = WATER;
			    isChanged = true;
			}else if(    current_square != AIR 
					 && up_square == WATER 
					 && left_square == AIR
					 && right_square != AIR){
				up_square = AIR;
			    left_square = WATER;
			    isChanged = true;
			}else if(    current_square == WATER 
					 && up_square == AIR 
					 && right_square == undefined){
				current_square = AIR;
				isChanged = true;
            }else if(    current_square == WATER 
					 && up_square == AIR 
					 && left_square == AIR
					 && right_square != AIR){
				current_square = AIR;
			    left_square = WATER;
			    isChanged = true;
            }else if(    current_square == WATER 
					 && up_square == AIR 
					 && left_square != AIR
					 && right_square == AIR){
				current_square = AIR;
			    right_square = WATER;
			    isChanged = true;
            }else if(    current_square == WATER 
					 && up_square == AIR 
					 && right_square == undefined){
				current_square = AIR;
				isChanged = true;
            }else if(    current_square == WATER 
					 && up_square == AIR 
					 && left_square == undefined
					 ){
				current_square = AIR;
				isChanged = true;
            }
            else if(    current_square == WATER 
					 && up_square == AIR 
					 && left_square == AIR
					 && right_square == AIR){
				current_square = AIR;
				isChanged = true;
            }else if(  current_square == WATER 
					 && up_square == AIR 
					 && left_square == WATER
					 && right_square == AIR){
				current_square = AIR;
				isChanged = true;
            }else if(current_square == LAND
            	     && up_square == WATER
            	     && left_square == undefined){
            	up_square = AIR;
            	isChanged = true;
            }


			map[y-1][x] = up_square;
			map[y][x]   = current_square;
			map[y][x+1] = right_square;
			map[y][x-1] = left_square;

		}
	}
	return map;
}

function parseInputMapToInt(map){
	ret = [];

	for (i = 0; i<map.length ; i++){
		ret.push(parseInt(map[i]));
	}

	return ret;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

