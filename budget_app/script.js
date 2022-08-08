function update (){
    window.location.href = "file:///C:\Users\Mayoro\Desktop\gestionde_budget/budget.html";
}
function netlify (){
    window.location.href = "https://id-geniecode.netlify.app/";
}


//Recuperer le DOM
//modal Depense
const modal= document.querySelector("#my-modal"); //recuperer l'id du modal 
const modalBtn= document.querySelector("#modal-btn"); // recuperer l'id du button qui affiche le modal
const closeBtn= document.querySelector(".close");  //recuperer le classe qui ferme le modal
//modal revenu
const modalR=document.querySelector("#my-modalR");
const modalBtnR= document.querySelector("#modal-btnR")
const closeR=document.querySelector(".closeR")

//evenements qui se passe
//modal depense
modalBtn.addEventListener("click",openModal); //clique sur le button ajouter depenses
closeBtn.addEventListener("click",closeModal); // clique pour fermer
window.addEventListener("click",outsideClick); //clique sur la page

//methode qu affiche le modal
function openModal(){
    modal.style.display="block";
}

//methode pour fermer le modal 
function closeModal(){
    modal.style.display="none";
}

//cliquer n'importe ou pour fermer le modal
function outsideClick(e){
    if (e.target==modal){
        modal.style.display="none";
    }
}

//evenements qui se passe
//modal revenu
modalBtnR.addEventListener("click",openModalR);
closeR.addEventListener("click",closeModalR);
window.addEventListener("click",outsideClickR)

//methode qu affiche le modal revenu
function openModalR(){
    modalR.style.display="block";
}

//methode pour fermer le modal revenu
function closeModalR(){
    modalR.style.display="none";
}

//cliquer n'importe ou pour fermer le modal revenu
function outsideClickR(e){
    if (e.target==modalR){
        modalR.style.display="none";
    }
}

//recuperation des id 

const revenu= document.getElementById('symbolRevenu');
const depense= document.getElementById('symbolDepense');
const solde=document.getElementById('symbolSolde');

//const formDep= document.getElementById('form-depense')
const descDep= document.getElementById('dec_depense');
const mtnDep= document.getElementById('montant_depense');

// const formRev= document.getElementById('form-revenu');
const descRev= document.getElementById('desc_revenu');
const mtnRev= document.getElementById('montant_revenu');

const afficheDep= document.getElementById('liste-Dep');
const afficheRev= document.getElementById('liste-Rev');

const form_revenu= document.getElementById('form_revenu');
const form_depense= document.getElementById('form_depense');

// obtenir les transactions a partir du local storage
const localStorageTransactions= JSON.parse(localStorage.getItem('transactions'));

let transactions= localStorage.getItem('transactions') !== null ? localStorageTransactions :[];

//ajuter transactions
function ajoutTransaction(e){
    e.preventDefault();
  //affiche d'un message d'erreur si un champs n'est paas rempli 
    if(descRev.value.trim() === "" || mtnRev.value.trim()=== "") {
        document.getElementById('error_msg').innerHTML=
            "<span>Erreur: il faut remplir tous les champs</span>";
        setTimeout(
            ()=>(document.getElementById('error_msg').innerHTML = ""),
            5000
        );
    } else{
        //insertion des donnees sur la base local Storage
        const transaction={
            id: generateID(),
            descRev: descRev.value,
            mtnRev: +mtnRev.value,
        };

        transactions.push(transaction);

        ajoutTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        descRev.value= "";
        mtnRev.value= "";
    }
}

//generer aleatoirement un id Random
function generateID(){
    return Math.floor(Math.random()*100000000);
}

//historiques des transactions
function ajoutTransactionDOM(transaction){
    //recuperer le signe
    const signe= transaction.mtnRev< 0 ? "-" : "+";
    //creation d'une balise ou lon veut afficher le resultat
    const balise= document.createElement("li");

    balise.classList.add(transaction.mtnRev < 0 ? "minus" : "plus");

    //affichage dans la balise
     balise.innerHTML = `
    ${transaction.descRev}  ${signe}${Math.abs(
    transaction.mtnRev
  )} <button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })"><i class="fa-regular fa-trash-can"></i></button>
  `;
//ajout 
  afficheRev.appendChild(balise);
}

//metttre a jour les valeurs budget solde et depense //les calculs
function updateValues(){
    const montants=transactions.map((transaction)=>transaction.mtnRev);

    const symbolSolde= montants.reduce((bal, value)=> (bal += value), 0).toFixed(2);
    const symbolRevenu= montants
        .filter((value) => value > 0)
        .reduce((bal, value) => (bal += value), 0)
        .toFixed(2);

    const symbolDepense =
        montants
            .filter((value) => value < 0)
            .reduce((bal, value) => (bal += value), 0) * -(1).toFixed(2);
            
    revenu.innerText = `${symbolRevenu}CFA`;
    depense.innerText = `${symbolDepense}CFA`;
    solde.innerText = `${symbolSolde}CFA`;

}
// supprimer une transactions par son id
function removeTransaction(id) {
    transactions = transactions.filter((transaction) => transaction.id !== id);
  
    updateLocalStorage();
  
    start();
  }
  
  // Update local storage transactions
  function updateLocalStorage() {
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  // Start app
  function start() {
    afficheRev.innerHTML = "";
    transactions.forEach(ajoutTransactionDOM);
    updateValues();
  }
  
  start();

form_revenu.addEventListener("submit",ajoutTransaction);
