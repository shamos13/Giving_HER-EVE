import Header from "./Header.jsx";

const Hero = ()=>{
    return (
        <div className="min-h-screen mb-4 bg-cover bg-center flex items-center justify-center w-full overflow-hidden"
        style={{backgroundImage: "url('/hero.png')"}}>
            <Header/>
        </div>
    )
}

export default Hero;