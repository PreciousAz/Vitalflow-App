
var paymentsList = [];

function renderTable(rows) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";
  if (rows.length > 0) {
    rows.forEach((item, index) => {
      const statusClass = item.status.toLowerCase();
      tbody.innerHTML += `
      <tr onclick="rowClicked('${item.name}')">
        <td>${index + 1}</td>
        <td> ${item.patient_name}</td>
        <td>${formatDate(item.date)}</td>
        <td>${item.gender}</td>
        <td>${item.consultation}</td>
        <td><span class="status ${statusClass}">${item.status}</span></td>
        <td>${item.amount}</td>
      </tr>
    `;
    });
  }else{
      tbody.innerHTML = `
        <tr></tr>
            <td colspan="9" class="text-center">No payment found</td>
        </tr>
        `;
  }

}

async function fetchPayments() {
  const user = JSON.parse(localStorage.getItem(stringStore.loginuserkey))
  if (user) {
    try {
      const response = await fetch(`${globalVariables.apiUrl}payment/user/${user.id}`);
      const payments = await response.json();
      if (payments.success) {
        //console.log('payments', payments.data);
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
/*  <td><button class="actions"><i class="bi bi-three-dots-vertical"></i></button></td> */
function search() {
  const value = document.getElementById("searchInput").value.toLowerCase();
  const filtered = paymentsList.filter((item) =>
    item.patient_name.toLowerCase().includes(value) || item.consultation.toLowerCase().includes(value) ||
    item.status.toLowerCase().includes(value)
  );
  renderTable(filtered);
}

document.getElementById("searchInput").addEventListener("input", function () {
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

function getGenderName(gender) {
  if (gender === 'M')
    return 'Male';
  else if (gender === 'F')
    return 'Female';
  else return 'Other';
}

//renderTable(payments);
fetchPayments();