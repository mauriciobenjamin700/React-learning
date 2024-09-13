import Banner from "./components/Banner";
import Container from "./components/Container";
import Footer from "./components/Footer";
import Header from "./components/Header";

  //O componente Container recebe todos os valores entre as tags como parâmetro e as adiciona dentro dele


function App() {
  return (
    <div>
      <Header/>
      <Banner image="banner-home.png"/>  
      <Container>  
        <h1>Hello World</h1>
        <p>My first React app</p>
      </Container>
      
    <Footer/>
    </div>
  );
}

export default App;

