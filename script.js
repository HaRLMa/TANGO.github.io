// ページの読み込みが完了したら実行
document.addEventListener('DOMContentLoaded', () => {

    const inputArea = document.getElementById('input-area');
    const generateBtn = document.getElementById('generateBtn');
    
    // ★★★ 新規追加: 色選択要素を取得 ★★★
    const colorEngInput = document.getElementById('color-eng');
    const colorJpnInput = document.getElementById('color-jpn');
    
    // プレビュー用のリストを取得
    const previewEngList = document.getElementById('preview-list-eng');
    const previewJpnList = document.getElementById('preview-list-jpn');
    
    // PDF生成用のリストを取得
    const pdfEngList = document.getElementById('word-list-eng');
    const pdfJpnList = document.getElementById('word-list-jpn');

    // ★★★ プレビューを更新する関数 (色適用ロジックを追加) ★★★
    function updatePreview() {
        // 入力値を取得
        const engInputs = document.querySelectorAll('.eng');
        const jpnInputs = document.querySelectorAll('.jpn');
        
        // ★★★ 選択された色を取得 ★★★
        const engColor = colorEngInput.value;
        const jpnColor = colorJpnInput.value;

        // プレビューのリストを一度空にする
        previewEngList.innerHTML = '';
        previewJpnList.innerHTML = '';

        for (let i = 0; i < 10; i++) {
            const eng = engInputs[i].value || '';
            const jpn = jpnInputs[i].value || '';

            // プレビューの英単語リストに行(li)を追加
            const liEng = document.createElement('li');
            liEng.textContent = eng;
            // ★色をインラインスタイルで適用
            liEng.style.color = engColor; 
            previewEngList.appendChild(liEng);
            
            // プレビューの日本語訳リストに行(li)を追加
            const liJpn = document.createElement('li');
            liJpn.textContent = jpn;
            // ★色をインラインスタイルで適用
            liJpn.style.color = jpnColor; 
            previewJpnList.appendChild(liJpn);
        }
    }

    // --- 1. 入力欄を10セット動的に生成する ---
    for (let i = 1; i <= 10; i++) {
        const div = document.createElement('div');
        div.className = 'word-pair';
        div.innerHTML = `
            <span>${i}.</span>
            <input type="text" class="eng" placeholder="英単語 ${i}">
            <input type="text" class="jpn" placeholder="日本語訳 ${i}">
        `;
        inputArea.appendChild(div);
    }

    // ★★★ すべての入力欄と色選択欄に「変更されたらプレビューを更新する」イベントを追加 ★★★
    const allInputs = document.querySelectorAll('.eng, .jpn');
    allInputs.forEach(input => {
        // 'input' イベントは、キーをタイプするたびに発生する
        input.addEventListener('input', updatePreview);
    });
    // ★色選択欄にもイベントを追加
    colorEngInput.addEventListener('input', updatePreview);
    colorJpnInput.addEventListener('input', updatePreview);

    // ★★★ ページ読み込み時にも一度、プレビューを初期化する ★★★
    updatePreview();


    // --- 2. 「PDFを作成」ボタンが押されたときの処理 ---
    generateBtn.addEventListener('click', () => {
        
        generateBtn.disabled = true;
        generateBtn.textContent = 'PDFを作成中...';

        // --- 2-1. 入力された値を取得 ---
        const engInputs = document.querySelectorAll('.eng');
        const jpnInputs = document.querySelectorAll('.jpn');
        
        // ★★★ 選択された色を再度取得 (PDF生成用) ★★★
        const engColor = colorEngInput.value;
        const jpnColor = colorJpnInput.value;
        
        // --- 2-2. PDF化する「非表示の」リストを生成・更新する (★色適用ロジックを追加) ---
        pdfEngList.innerHTML = ''; 
        pdfJpnList.innerHTML = ''; 

        for (let i = 0; i < 10; i++) {
            const eng = engInputs[i].value || '(未入力)';
            const jpn = jpnInputs[i].value || '(未入力)';

            const liEng = document.createElement('li');
            liEng.textContent = eng;
            // ★PDF生成リストにも色をインラインスタイルで適用
            liEng.style.color = engColor; 
            pdfEngList.appendChild(liEng); 
            
            const liJpn = document.createElement('li');
            liJpn.textContent = jpn;
            // ★PDF生成リストにも色をインラインスタイルで適用
            liJpn.style.color = jpnColor; 
            pdfJpnList.appendChild(liJpn); 
        }

        // --- 2-3. PDFの作成処理 (変更なし) ---
        // (ブラウザの描画を待つ処理)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => { 
            
                const { jsPDF } = window.jspdf;
                const canvasGenerator = window.html2canvas;
                // 対象は #pdf-page (非表示のPDFテンプレート) のまま
                const elementToCapture = document.getElementById('pdf-page');

                canvasGenerator(elementToCapture, {
                    scale: 2 
                }).then(canvas => {
                    
                    const imgData = canvas.toDataURL('image/png');
                    const doc = new jsPDF('l', 'mm', 'a4'); 
                    doc.addImage(imgData, 'PNG', 0, 0, 297, 210); 
                    doc.save('my-wordbook-landscape.pdf'); 

                }).catch(err => {
                    console.error("PDFの作成に失敗しました:", err);
                    alert("PDFの作成に失敗しました。コンソールを確認してください。");

                }).finally(() => { 
                    generateBtn.disabled = false;
                    generateBtn.textContent = 'PDFを作成';
                });
            
            });
        });
    });
});
