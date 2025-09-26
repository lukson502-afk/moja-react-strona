import React from 'react';
import './App.css';

function PrivacyPolicy({ onBack }) {  // 👈 Dodaj onBack jako prop
  return (
    <div className="privacy-screen">
      <div className="privacy-content">
        <h1>POLITYKA PRYWATNOŚCI</h1>
        <p className="effective-date">Data obowiązywania: 26 września 2024</p>
        
        <div className="policy-text">
          <h2>1. ADMINISTRATOR DANYCH</h2>
          <p>Administratorem Twoich danych osobowych jest twórca serwisu Slang-Test.</p>
          <p><strong>Kontakt:</strong> slangtest.contact@gmail.com</p>

          <h2>2. JAKIE DANE PRZETWARZAMY</h2>
          <p>Nie zbieramy danych osobowych bezpośrednio. 
Google Analytics automatycznie zbiera:</p>
          <ul>
            <li>Zanonimizowany adres IP</li>
            <li>Informacje o przeglądarce i urządzeniu</li>
            <li>Kraj/region</li>
            <li>Aktywność na stronie</li>
          </ul>

          <h2>3. PODSTAWA PRAWNA I CEL</h2>
          <p>Dane przetwarzamy na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f RODO) w celu:</p>
          <ul>
            <li>Zapewnienia funkcjonowania serwisu</li>
            <li>Analizy ruchu i poprawy jakości usług</li>
          </ul>

          <h2>4. OKRES PRZECHOWYWANIA</h2>
          <p>Dane są przechowywane przez okres 12 miesięcy.</p>

          <h2>5. ODBIORCY DANYCH</h2>
          <p>Dane mogą być przekazywane do:</p>
          <ul>
            <li>Google Analytics (analiza ruchu)</li>
            <li>Netlify (hosting serwisu)</li>
          </ul>
          <p>Dane są przetwarzane przez zaufanych dostawców usług 
zgodnie z europejskimi standardami ochrony danych.</p>

          <h2>6. TWOJE PRAWA</h2>
          <p>Przysługuje Ci prawo do:</p>
          <ul>
            <li>Dostępu do danych</li>
            <li>Sprostowania danych</li>
            <li>Usunięcia danych</li>
            <li>Ograniczenia przetwarzania</li>
            <li>Przenoszenia danych</li>
            <li>Sprzeciwu</li>
          </ul>
          <p>W celu skorzystania z praw skontaktuj się: slangtest.contact@gmail.com</p>

          <h2>7. PRAWO DO SKARGI</h2>
          <p>Masz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych.</p>

          <h2>8. PLIKI COOKIES</h2>
          <p>Serwis używa plików cookies do analizy ruchu. Możesz je wyłączyć w przeglądarce.</p>
        </div>

        {/* 👈 ZMIANA: użyj onBack zamiast window.history.back() */}
        <button className="back-button" onClick={onBack}>
          Powrót
        </button>
      </div>
    </div>
  );
}

export default PrivacyPolicy;