
var paymentsList = [];

function renderTable(rows) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  rows.forEach((item, index) => {
    const statusClass = item.status.toLowerCase();
    tbody.innerHTML += `
      <tr onclick="rowClicked('${item.name}')">
        <td>${index + 1}</td>
        <td>${item.doctor_name}</td>
        <td>${formatDate(item.date)}</td>
        <td>${item.gender}</td>
        <td>${item.consultation}</td>
        <td><span class="status ${statusClass}">${item.status}</span></td>
        <td>${item.amount}</td>
      </tr>
    `;
  });
}

async function fetchPayments() {
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey))
  if (user) {
    try {
      const response = await fetch(`${globalVariables.apiUrl}payment/user/${user.id}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const payments = await response.json();
      if (payments.success) {
        renderTable(payments.data);
        paymentsList = payments.data; // Store the fetched payments in the global variable
      } else {
        console.error("Failed to fetch payments:", payments.message);
      }
    } catch (error) {
      console.error("Error fetching payment:", error);
    }
  }

}

{/* <td><img src="${item.avatar}" alt="${item.name}" /> ${item.name}</td> */ }

function search() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  const filtered = paymentsList.filter((item) =>
    item.doctor_name.toLowerCase().includes(value) || item.consultation.toLowerCase().includes(value) ||
    item.status.toLowerCase().includes(value)
  );
  renderTable(filtered);
}

document.getElementById("searchInput").addEventListener("input", function() {
    if (this.value.trim() === "") {
        search(); 
    }
});

function rowClicked(name) {
  alert("Clicked on " + name);
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

renderTable(payments);
fetchPayments();