/*
to test without logic operators:
let test = 3;
let example = 2;
fn main() {
test := 5;
example := 6;
}

to test with logic operators (or not)
let test = 3;
let example = 2;
fn main() {
test := 5>6; //return false
example := 6;
}

to test basics data types
let test = 0;
let example = null;
let hello = false;
let good = 0;
let declaredvars = 0;
let isempty = false;
fn main() {
test := 1800;
example := "B";
hello := true;
good := 55.5;
declaredvars := 41;
isempty := true;
}

to test vars declaration
let mut test = 0;
let mut example = null;
let hello = false;
let mut good = 0;
let declaredvars = 0;
let isempty = false;
*/

const regEx = {
    'varDeclaration': /(let\smut|let)\s([A-Za-z]+)\s=\s(([0-9999]+|[A-Za-z]+)|(([A-Za-z]+|[0-9999]+)\s(\+|\*|\-|\/)\s([0-9999]+|[A-Za-z]+)))\;$/im,
    'checkVar': /^(let)/i,
    'checkFunction': /^(fn\smain\(\)\s\{)\n(.*?(\n))+.*?\n(\})$/,
    'assignVar': /^([A-Za-z]+)\s:=\s(([A-Za-z]+)|(")([A-Za-z]+)(")|((-)?([0-9]+))|((-)?([0-9]+)\.([0-9]+))|((-)?([0-9]+)(&&|>=|<=|==|!=|>|<)((-)?[0-9]+)));$/,
    'logicOpes': /(&&|>=|<=|==|!=|>|<)/
}

let compiled = [];

const $ = (id) => document.getElementById(id);

const compilerEvent = () => {
    $('output-text').innerHTML = 'Compiling...';
    $('output-text').style.color = 'white';
    setTimeout(compiler, 1000);
}

const compiler = () => {
    try {
        let syntax = (document.getElementById('code-i').value).trim();
        let lines = syntax.split('\n');
        let declaredVarsOk;
        let declaredVars = [];
        let assignedVars = [];
        console.log(lines.indexOf('fn main() {'));
        if (syntax.includes('fn main() {')) { // SI ES DECLARACION DE VARIABLES + LA FUNCIÓN
            let wheresBegin = lines.indexOf('fn main() {'); // FUNCION
            // TRABAJA SIN TOCAR LAS PRINCIPALES LINEAS DEL ARREGLO (COMPLETE SYNTAX)
            let li = lines.slice(0);
            let l = lines.slice(0);
            l.length = wheresBegin;     
            declaredVarsOk = (l.every(checkArray)); // EVALUAMOS SI TODAS LAS VARIABLES ESTAN BIEN DECLARADAS   
            if (declaredVarsOk) {
                li.map((l) => (((l.includes('let')) ? lines.splice(l.indexOf('let'), 1) : false))); // ELIMINA LAS VARIABLES DECLARADAS
                let funcc = (lines.join()).replace(/,/g, '\n');// TRANSFORMAMOS EL ARREGLO A STRING CON JOIN(), LUEGO REEMPLAZAMOS LAS COMAS (,) CON \n
                console.log("funcc -->"+funcc);
                if (regEx.checkFunction.test(funcc)) { //EVALUAMOS LA FUNCION, FROM 'fn main() {' TO '}'
                    let func = (funcc.split('\n')).slice(1, -1); // OBTENEMOS QUE ESTA ESCRITO ENTRE -fn main() {- && -}- (DECLARACION DE VARIABLES)
                    l.map((li) => declaredVars.push(li.split(' ')[1])); //REALIZAMOS UN PUSH DENTRO DECLAREDVARS ARRAY DE LAS DECLARED VARS (VARIABLES DECLARADAS)
                    func.map((line) => {
                        console.log(line)
                        if (regEx.assignVar.test(line)) { //EVALUAMOS LAS VARIABLES DECLARADAS (VARIABLEHERE := ASD O NUMERP OR NUMER>5)
                            l.map((i) => {
                                console.log(i.split(' ')[0]);
                                if ((line.split(' ')[0]) === (i).split(' ')[1]) { //OBTENIENDO LA MISMA VARIABLE
                                    console.log('=======')
                                    console.warn(line);
                                    console.warn(i);
                                    console.log('=======');
                                    checkDataType((i.split(' ')[3]), (line.split(' ')[2])); //EVALUANDO (DATATYPE, VALUE) OBTENIDO EN EL PROCEDIMIENTO
                                }
                            });
                            if (regEx.logicOpes.test((line.split(':='))[1].trim())) {
                                let ope = (line.split(':='))[1].trim();
                                try {
                                    console.log('Variable: ' + line + ' es operacion logica. y el resultado es: ' + eval(ope));
                                } catch (e) {
                                    console.error('Operacion logica invalida.. Linea -> ' + e);
                                    compilerOutput(false, 'Error. Operacion logica invalida');
                                    compiled.push(false);
                                }
                            }
                            console.log('Variables asignadas correctamente');
                            assignedVars.push(line.split(' ')[0]); //PUSH DENTRO DEL ARREGLO                  
                        } else {
                            console.log('Error -> Asignacion de variables, Operador logico ó ;');
                            compilerOutput(false, 'Error -> Asignacion de variables, Operador logico ó ;');
                            compiled.push(false);
                        }
                    });
                    let c = 0;
                    if (compiled.length === 0) {
                        declaredVars.map((dv) => ((assignedVars.includes(dv)) ? c++ : false));
                        ((c++ === assignedVars.length) ? (compilerOutput(true, 'Compilacion exitosa...!')) : (compilerOutput(false, 'Error. Las variables designadas no son iguales a las declaradas')));
                    }
                } else {
                    console.log('Error en la funcion');
                    compilerOutput(false, 'Error -> Proceso -> fn main() { TO } ');
                    compiled.push(false);
                }
            } else {
                console.error('Mala declaracion de variables');
                compilerOutput(false, 'Error en las declaracion de variables...');
                compiled.push(false);
            }
        } else { // SÓLO DECLARACIÓN DE VARIABLES
            console.log(lines)
            declaredVarsOk = lines.every(checkArray);
            ((declaredVarsOk) ? compilerOutput(true, 'Variables correctamente declaradas') : compilerOutput(false, 'Evaluar las variables declaradas'));
        }

    } catch (e) {
        console.log('Error->' + e);
        compilerOutput(false, 'Error. Syntax error...');
        compiled.push(false);
    } finally {
        compiled = [];
    }
}

const checkArray = elem => regEx.varDeclaration.test(elem);

const compilerOutput = (success, msg) => {
    $('output-text').innerHTML = msg;
    ((success) ? $('output-text').style.color = 'rgb(0, 255, 0)' : $('output-text').style.color = 'red');
}

const checkDataType = (datatype, s) => {
    console.log(datatype);
    console.log(s);
    let strarr = ((s.replace(/;/g, '')).split(' '));
    let dtype = datatype.replace(/;/g, '');
    let strlength = (strarr.length - 1);
    let ope = 'FLOAT'
    switch (dtype) {
        case 'INTEGER':
            let num = parseInt(strarr[strlength]);
            if (String(s).includes('.')) {
                compilerOutput(false, 'VAR DECLARED INTEGER, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            } else {
                if (Number.isInteger(num)) {
                    console.log('enteroo');
                    return true;
                } else {
                    console.log('VARIABLE DECLARADA COMO ENTERO, BUT ANOTHER TYPE WAS GIVEN');
                    compilerOutput(false, 'VAR DECLARED INTEGER, BUT ANOTHER TYPE WAS GIVEN');
                    compiled.push(false);
                };
            }

            break;
        case 'BOOLEAN':
            try {
                ((typeof (eval(strarr[strlength])) === 'boolean') ? true : compiled.push(false));
            } catch (Exception) {
                compilerOutput(false, 'VAR DECLARED BOOLEAN, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
            break;
        case 'FLOAT':
            if ((/\./g).test(strarr[strlength])) {
                let num = parseFloat(strarr[strlength]);
                console.log(`Numero float: ${num}`);
                return true;
            } else {
                console.log('no es float');
                compilerOutput(false, 'VAR DECLARED FLOAT, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
            break;
        case 'CHAR':
            console.log(s.split('"')[1].length)
            if (!(s.split('"')[1].length > 1)) {
                console.log('es char')
                return true;
            } else {
                compilerOutput(false, 'VAR DECLARED CHAR, BUT ANOTHER TYPE WAS GIVEN');
                compiled.push(false);
            }
    } // switch

};