document.addEventListener("DOMContentLoaded", function () {
    const fetchDataButton = document.getElementById("fetchData");
    const getResultDiv = document.getElementById("getResult");
    const sendPostDataButton = document.getElementById("sendPostData");
    const postResultDiv = document.getElementById("postResult");
    const sendPatchDataButton = document.getElementById("sendPatchData");
    const patchResultDiv = document.getElementById("patchResult");
    const sendDeleteDataButton = document.getElementById("sendDeleteData");
    const deleteResultDiv = document.getElementById("deleteResult");
    const dataBody = document.getElementById("dataBody");

    fetchDataButton.addEventListener("click", async () => {
        try {
            const response = await fetch("https://spring-boot-rest-api-7el0.onrender.com/users/all");
            if (!response.ok) {
                throw new Error(`Erro na requisição GET: ${response.statusText}`);
            }
            const data = await response.json();

            dataBody.innerHTML = "";

            if (data && data.length > 0) {
                data.forEach(user => {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.account.number}</td>
                        <td>${user.account.agency}</td>
                        <td>${user.account.balance}</td>
                        <td>${user.account.limit}</td>
                        <td>${user.card.number}</td>
                        <td>${user.card.limit}</td>
                    `;
                    dataBody.appendChild(row);
                });

                getResultDiv.innerHTML = "Dados buscados com sucesso e exibidos na tabela.";
            } else {
                getResultDiv.innerHTML = "Nenhum usuário encontrado.";
            }
        } catch (error) {
            console.error(error);
            getResultDiv.innerHTML = "Erro ao buscar dados da API (GET).";
        }
    });
    sendPostDataButton.addEventListener("click", async () => {
        const postData = {
            name: document.getElementById("name").value,
            account: {
                number: document.getElementById("accountNumber").value,
                agency: document.getElementById("agency").value,
                balance: parseFloat(document.getElementById("balance").value),
                limit: parseFloat(document.getElementById("limit").value),
            },
            card: {
                number: document.getElementById("cardNumber").value,
                limit: parseFloat(document.getElementById("cardLimit").value),
            }
        };
    
        try {
            const response = await fetch("https://spring-boot-rest-api-7el0.onrender.com/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
            });
    
            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro na requisição POST: ${response.statusText}\n${errorMessage}`);
            }
    
            const responseData = await response.json();
            const postSuccessMessage = document.getElementById("postSuccessMessage");
            postSuccessMessage.textContent = "Dados enviados com sucesso!";
            postSuccessMessage.style.color = "green";
        } catch (error) {
            console.error(error);
            const postSuccessMessage = document.getElementById("postSuccessMessage");
            postSuccessMessage.textContent = "Erro ao enviar dados para a API (POST).";
            postSuccessMessage.style.color = "red";
        }
    });
    
    sendPatchDataButton.addEventListener("click", async () => {
        const userId = document.getElementById("patchUserId").value;

        const patchData = {};

        const newName = document.getElementById("patchUserName").value;
        if (newName) {
            patchData.name = newName;
        }

        const newAccountNumber = document.getElementById("patchAccountNumber").value;
        if (newAccountNumber) {
            patchData.account = patchData.account || {};
            patchData.account.number = newAccountNumber;
        }

        const newAgency = document.getElementById("patchAgency").value;
        if (newAgency) {
            patchData.account = patchData.account || {};
            patchData.account.agency = newAgency;
        }

        const newBalance = parseFloat(document.getElementById("patchBalance").value);
        if (!isNaN(newBalance)) {
            patchData.account = patchData.account || {};
            patchData.account.balance = newBalance;
        }

        const newLimit = parseFloat(document.getElementById("patchLimit").value);
        if (!isNaN(newLimit)) {
            patchData.account = patchData.account || {};
            patchData.account.limit = newLimit;
        }

       

        const newCardNumber = document.getElementById("patchCardNumber").value;
        if (newCardNumber) {
            patchData.card = patchData.card || {};
            patchData.card.number = newCardNumber;
        }

        const newCardLimit = parseFloat(document.getElementById("patchCardLimit").value);
        if (!isNaN(newCardLimit)) {
            patchData.card = patchData.card || {};
            patchData.card.limit = newCardLimit;
        }

        if (Object.keys(patchData).length === 0) {
            patchResultDiv.innerHTML = "Nenhum campo para atualizar.";
        } else {
            try {
                const response = await fetch(`https://spring-boot-rest-api-7el0.onrender.com/users/${userId}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(patchData),
                });

                if (!response.ok) {
                    const errorMessage = await response.text();
                    throw new Error(`Erro na requisição PATCH: ${response.statusText}\n${errorMessage}`);
                }

                patchResultDiv.innerHTML = "Dados atualizados com sucesso.";
            } catch (error) {
                console.error(error);
                patchResultDiv.innerHTML = "Erro ao enviar solicitação PATCH.";
            }
        }
    });

    async function sendDeleteRequest(userId) {
        try {
            const response = await fetch(`https://spring-boot-rest-api-7el0.onrender.com/users/${userId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Erro na requisição DELETE: ${response.statusText}\n${errorMessage}`);
            }

            deleteResultDiv.innerHTML = `Usuário com ID ${userId} excluído com sucesso.`;
        } catch (error) {
            console.error(error);
            deleteResultDiv.innerHTML = "Erro ao enviar solicitação DELETE.";
        }
    }

    sendDeleteDataButton.addEventListener("click", () => {
        const userId = document.getElementById("deleteUserId").value;
        sendDeleteRequest(userId);
    });
});