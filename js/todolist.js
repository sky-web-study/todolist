//グローバル変数
const todoInput = document.getElementById("todoInput");
todoInput.onkeypress = enterPressAndTodoInput;
//グローバル関数
const getClassName = cName => document.getElementsByClassName(cName);

//テキストボックス内でEnterキーが押下された時の入力値(todo)を取得
function enterPressAndTodoInput(event){

  //Enterキーが押下された時点での入力値の取得
  const input_todo = todoInput.value;

  //エンターキー押下&&todo入力済み
  if((event.key === "Enter") && (input_todo !== "")){
    console.dir({event , input_todo});

    //todoList表示領域作成
    createDispDolist(input_todo);

    //input内容をDolistに表示
    displayInputDolist();
  }
}

//todoList表示領域の作成
function createDispDolist(text){

  //入力された文字列をエンコード
  const encodedText = encodeURI(text);

  //<dolist-item>の作成
  const newLi = document.createElement("li");
  newLi.className = "dolist-item";
  newLi.innerHTML = `<input type="checkbox" class="list-chk" data-todo="false"/>
    <span class="dolist-txt" data-todo="txt">${encodedText}</span>
    <button class="material-icons" data-todo="false">delete</button>`;

    //<dolist-contents>要素の最後尾に拡張した要素を追加
    const dolist_contents = getClassName("dolist-contents");
    const createdElement = dolist_contents[0].appendChild(newLi);
    //createdElement.children[1]は "dolist-txt"のことを指す
    const dolistTxt = createdElement.children[1];
    console.dir(createdElement);

    //入力値のデコードを行い、"dolist-txt"の内容を更新
    dolistTxt.innerText = decodeURI(dolistTxt.innerText);

    //dataset:textにTodoのtext内容をセット
    const span = createdElement.getElementsByTagName('span')[0];
    span.dataset.todo = dolistTxt.innerText;
    console.log(span);

    //"list-chk"にcheckboxがON/OFFされたときのイベントを設定
    createdElement.onchange = chkboxChanged;
    //buttonがクリックされた時のイベントを設定
    buttonElementAddEvent(createdElement);
}

//Inputした内容をDolistへ表示
function displayInputDolist(){

  // "dolistの表示領域を可視化";
  getClassName("dolist")[0].style.display = "block";

  //入力値の初期化
  todoInput.value = "";
}

//chkboxの切り替え検知
function chkboxChanged(event){

  const checked = event.target.checked;
  console.dir(event);

  //chk=OFF → ONに変更
  if(checked){
    //dolist/doneList表示領域切り替えの指定
    createSwitchDispList(event, "donelist-contents");
  //chk=ON → OFFに変更
  }else{
    //dolist/doneList表示領域切り替えの指定
    createSwitchDispList(event, "dolist-contents");
  }

  //表示領域の更新
  displayDoDonelist();
}

//dolist/doneList表示領域切り替えの指定
function createSwitchDispList(event, cName){

  //checkされた要素(dolist-item or donelist-item)を取得
  const chkElement = event.path[0].parentNode;
  console.log(chkElement);

  //dataset:inputにTodoのcheck状態をセット
  const input = chkElement.getElementsByTagName('input')[0];
  input.dataset.todo = event.target.checked;
  console.log(input);

  //dolist-item(donelist-item)を複製して、donelist(dolist)に追加
  const setlist = chkElement.cloneNode(true);
  const setlist_contents = getClassName(cName);
  const setlist_Element = setlist_contents[0].appendChild(setlist);
  //"list-chk"にcheckboxがON/OFFされたときのイベントを設定
  setlist_Element.onchange = chkboxChanged;
  //buttonがクリックされた時のイベントを設定
  buttonElementAddEvent(setlist_Element);

  //checkされたdolist-itemをdo-list(doneList)から削除
  event.path[0].parentNode.remove();
}

//Donelistの表示領域を可視化
function displayDoDonelist(){

  //dolistの表示要素がなくなれば、"dolist"を非表示にする
  if(todoCountNo("dolist-contents") === 0){
    getClassName("dolist")[0].style.display = "none";
  }else{
    // "dolistの表示領域を可視化";
    getClassName("dolist")[0].style.display = "block";
  }

  //donelistの表示要素がなくなれば、"donelist"を非表示にする
  if(todoCountNo("donelist-contents") === 0){
    getClassName("donelist")[0].style.display = "none";
  }else{
    // "donelistの表示領域を可視化";
    getClassName("donelist")[0].style.display = "block";
  }
}

//<dolist-item>のindex番号の取得
function todoCountNo(listName){

  const listItemCount = getClassName(listName);

  //dolist-contents(donelist-countents)の子要素の数を取得
  console.log(listItemCount[0].childElementCount);
  return listItemCount[0].childElementCount;
}

function buttonElementAddEvent(element){
    element.children[2].addEventListener("click", function() {
      //clickされたdolist-itemをdo-list(doneList)から削除
      element.remove();
      //表示領域の更新
      displayDoDonelist();
    });
}