# Roddie Walker Tours — Walking Tours in Lisbon

[![Website](https://img.shields.io/badge/website-roddiewalker--tours.com-orange)](https://www.roddiewalker-tours.com)
[![GitHub Pages](https://img.shields.io/badge/hosted%20on-GitHub%20Pages-blue)](https://pages.github.com/)

---

## 🇵🇹 Português

### Sobre o Projeto

**Roddie Walker Tours** é o website oficial de tours a pé em Lisboa, guiados por Rodrigo, um lisboeta apaixonado pela história e cultura da cidade. O site apresenta informações sobre os percursos disponíveis, permite contacto para reservas e oferece um panfleto digital descarregável.

### Funcionalidades

- **Website bilingue** — Disponível em Português e Inglês
- **Percursos interativos** — Lista de tours carregada dinamicamente a partir de um ficheiro JSON
- **Filtros por categoria** — Filtre tours por "Destaques", "Fácil" ou "Moderado"
- **Modal com itinerário** — Visualize o itinerário completo de cada tour
- **Slideshow de imagens** — Galeria de fotos de Lisboa na página inicial
- **Formulário de contacto** — Envia pedidos de reserva por email
- **Panfleto digital** — Gera um PDF em formato A4 com informações sobre tours privados e QR Code
- **Design responsivo** — Otimizado para desktop, tablet e telemóvel

### Tecnologias Utilizadas

| Tecnologia | Descrição |
|------------|-----------|
| HTML5 | Estrutura do site |
| CSS3 | Estilização e design responsivo |
| JavaScript (ES6) | Interatividade, filtros, slideshow e geração de PDF |
| jsPDF | Biblioteca para geração de PDF do panfleto |
| QR Server API | Geração de QR Code para o panfleto |
| GitHub Pages | Hospedagem do site |

### Estrutura de Pastas

```
/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── scripts.js
│   ├── logo/
│   │   └── favicon_512.png
│   └── photos/
│       ├── Rod-photo.png
│       ├── alfama.jpg
│       ├── belem.jpg
│       ├── lisbon-historical.jpg
│       ├── literaria.jpg
│       ├── streetart.jpg
│       ├── food.jpg
│       └── lisbon-1.jpg ... lisbon-10.jpg
├── data/
│   └── percursos.json
├── en/
│   ├── index.html
│   ├── tours.html
│   ├── about.html
│   └── contact.html
├── pt/
│   ├── index.html
│   ├── tours.html
│   ├── about.html
│   └── contact.html
├── CNAME
└── README.md
```

### Como Executar Localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/SEU_USUARIO/roddiewalker-tours.git
   ```

2. Navegue até a pasta do projeto:
   ```bash
   cd roddiewalker-tours
   ```

3. Abra o ficheiro `index.html` na raiz ou utilize um servidor local:
   ```bash
   python -m http.server 8000
   ```

### Deploy

O site está hospedado no **GitHub Pages** com domínio personalizado. Para fazer deploy:

1. Faça push das alterações para o branch `main`
2. O GitHub Pages irá atualizar automaticamente o site

---

## 🇬🇧 English

### About the Project

**Roddie Walker Tours** is the official website for walking tours in Lisbon, guided by Rodrigo, a Lisbon native passionate about the city's history and culture. The site presents available tours, allows contact for bookings, and offers a downloadable digital flyer.

### Features

- **Bilingual website** — Available in Portuguese and English
- **Interactive tours** — Tour list dynamically loaded from a JSON file
- **Category filters** — Filter tours by "Featured", "Easy", or "Moderate"
- **Itinerary modal** — View the complete itinerary for each tour
- **Image slideshow** — Photo gallery of Lisbon on the homepage
- **Contact form** — Sends booking requests via email
- **Digital flyer** — Generates an A4 PDF with information about private tours and QR Code
- **Responsive design** — Optimized for desktop, tablet, and mobile

### Technologies Used

| Technology | Description |
|------------|-------------|
| HTML5 | Site structure |
| CSS3 | Styling and responsive design |
| JavaScript (ES6) | Interactivity, filters, slideshow, and PDF generation |
| jsPDF | PDF generation library for the flyer |
| QR Server API | QR Code generation for the flyer |
| GitHub Pages | Website hosting |

### Folder Structure

```
/
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── scripts.js
│   ├── logo/
│   │   └── favicon_512.png
│   └── photos/
│       ├── Rod-photo.png
│       ├── alfama.jpg
│       ├── belem.jpg
│       ├── lisbon-historical.jpg
│       ├── literaria.jpg
│       ├── streetart.jpg
│       ├── food.jpg
│       └── lisbon-1.jpg ... lisbon-10.jpg
├── data/
│   └── percursos.json
├── en/
│   ├── index.html
│   ├── tours.html
│   ├── about.html
│   └── contact.html
├── pt/
│   ├── index.html
│   ├── tours.html
│   ├── about.html
│   └── contact.html
├── CNAME
└── README.md
```

### How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/roddiewalker-tours.git
   ```

2. Navigate to the project folder:
   ```bash
   cd roddiewalker-tours
   ```

3. Open the `index.html` file in the root or use a local server:
   ```bash
   python -m http.server 8000
   ```

### Deployment

The site is hosted on **GitHub Pages** with a custom domain. To deploy:

1. Push changes to the `main` branch
2. GitHub Pages will automatically update the site

---

## Contacto / Contact

**Roddie Walker Tours**  
📧 roddiewalker.tours@gmail.com  
📸 [@roddiewalker.tours](https://instagram.com/roddiewalker.tours)  
🌐 [www.roddiewalker-tours.com](https://www.roddiewalker-tours.com)

---

*Desenvolvido com ❤️ em Lisboa / Developed with ❤️ in Lisbon*
```

---

Para criar o ficheiro rapidamente:

1. **Copie todo o texto acima**
2. **Abra o Terminal (Mac) ou Prompt de Comando (Windows)**
3. **Execute**:
   ```bash
   cd /caminho/para/seu/projeto
   cat > README.md
   ```
4. **Cole o conteúdo** e prima `Ctrl+D` para guardar

Ou simplesmente crie um novo ficheiro no seu editor de código (VS Code, Sublime, etc.), cole o conteúdo e guarde como `README.md`.
