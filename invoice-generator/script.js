document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMENT SELECTORS ---
    // Input fields
    const inputDate = document.getElementById('input-date');
    const inputSrNo = document.getElementById('input-sr-no');
    const inputName = document.getElementById('input-name');
    const inputAdv = document.getElementById('input-adv');
    const itemInputsContainer = document.getElementById('item-inputs');
    
    // Output display elements
    const outputDate = document.getElementById('output-date');
    const outputSrNo = document.getElementById('output-sr-no');
    const outputName = document.getElementById('output-name');
    const invoiceItemsTable = document.getElementById('invoice-items-table');
    const outputTotal = document.getElementById('output-total');
    const outputAdv = document.getElementById('output-adv');
    const outputBal = document.getElementById('output-bal');

    // Buttons
    const addItemBtn = document.getElementById('add-item-btn');
    const generatePdfBtn = document.getElementById('generate-pdf-btn');

    // --- EVENT LISTENERS ---
    inputDate.addEventListener('input', () => outputDate.textContent = inputDate.value);
    inputSrNo.addEventListener('input', () => outputSrNo.textContent = inputSrNo.value);
    inputName.addEventListener('input', () => outputName.textContent = inputName.value);
    inputAdv.addEventListener('input', updateTotals);
    addItemBtn.addEventListener('click', addItemRow);
    generatePdfBtn.addEventListener('click', generatePDF);
    
    // --- FUNCTIONS ---
    
    function addItemRow() {
        const itemRowDiv = document.createElement('div');
        itemRowDiv.className = 'item-input-row';
        
        const descInput = document.createElement('input');
        descInput.type = 'text';
        descInput.placeholder = 'Description';
        descInput.className = 'item-desc';

        const qtyInput = document.createElement('input');
        qtyInput.type = 'number';
        qtyInput.placeholder = 'Qty';
        qtyInput.className = 'item-qty';
        qtyInput.value = 1;

        const rateInput = document.createElement('input');
        rateInput.type = 'number';
        rateInput.placeholder = 'Rate';
        rateInput.className = 'item-rate';
        rateInput.value = 0;

        itemRowDiv.appendChild(descInput);
        itemRowDiv.appendChild(qtyInput);
        itemRowDiv.appendChild(rateInput);
        itemInputsContainer.appendChild(itemRowDiv);

        [descInput, qtyInput, rateInput].forEach(input => {
            input.addEventListener('input', updateInvoice);
        });
        
        updateInvoice();
    }

    function updateInvoice() {
        invoiceItemsTable.innerHTML = '';
        const itemRows = itemInputsContainer.querySelectorAll('.item-input-row');
        
        itemRows.forEach(row => {
            const desc = row.querySelector('.item-desc').value;
            const qty = parseFloat(row.querySelector('.item-qty').value) || 0;
            const rate = parseFloat(row.querySelector('.item-rate').value) || 0;
            const amount = qty * rate;

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${desc}</td>
                <td>${qty.toLocaleString()}</td>
                <td>${rate.toFixed(2)}</td>
                <td class="item-amount">${amount.toFixed(2)}/-</td>
            `;
            invoiceItemsTable.appendChild(tr);
        });

        updateTotals();
    }

    function updateTotals() {
        let total = 0;
        document.querySelectorAll('.item-amount').forEach(amountCell => {
            total += parseFloat(amountCell.textContent.replace('/-', '')) || 0;
        });

        const advance = parseFloat(inputAdv.value) || 0;
        const balance = total - advance;

        outputTotal.textContent = `${total.toFixed(2)}/-`;
        outputAdv.textContent = `${advance.toFixed(2)}/-`;
        outputBal.textContent = `${balance.toFixed(2)}/-`;
    }

function generatePDF() {
    const element = document.getElementById('invoice-preview');

    // NEW, SIMPLIFIED OPTIONS
    const opt = {
      margin:       0,
      filename:     `Invoice-${document.getElementById('input-sr-no').value}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        // REMOVED `scale: 2` which was causing rendering to crash
        useCORS: true 
      },
      jsPDF:        { unit: 'in', format: 'a5', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save().catch(err => {
        console.error("PDF generation failed!", err);
    });
}

    // --- INITIALIZATION ---
    addItemRow();
    updateInvoice();
});