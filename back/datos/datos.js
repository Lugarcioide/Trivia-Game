export const juego = {
  usuarios: [
    { id: 1, username: "lugarcioide", password: "1234", foto: "img/lugarcioide.png" },
    { id: 2, username: "juanfran", password: "1234", foto: "img/kermit.png" },
    { id: 3, username: "gumi", password: "gumi2026", foto: null },
    { id: 4, username: "Bartolomeo", password: "barto", foto: null },
    { id: 5, username: "popilopopilopopilo", password: "popi", foto: null }
  ],

  trivias: [
    {
      id: 1,
      category: "Pokemon",            
      idAutor: 1,                   
      rating: 5,                    
      vecesJugada: 9863,              
      preguntas: [                  
        {
          pregunta: "¿Cuál es este pokemon?",
          correcta: "charmander",
          incorrectas: ["vulvasaur", "squirtle", "pikachu"]   
        }
      ]
    },
    {
      id: 2,
      category: "DnD",
      idAutor: 2,
      rating: 1,
      vecesJugada: 777,
      preguntas: [
        {
          pregunta: "¿Hace cuanto no jugamos DnD?",
          correcta: "Mucho tiempo",
          incorrectas: ["10 dias", "1 dia", "2 semanas"]   
        }

      ]
    },   
    {
      id: 3,
      category: "Adivina las Frutillitas",
      idAutor: 3,
      rating: 2,
      vecesJugada: 0,
      preguntas: [
        {
          pregunta: "¿Cuál es esta frutillita?",
          correcta: "frutillita",
          incorrectas: ["limoncita", "naranjita", "arandano"]   
        }
      ]
    },
    {
      id: 4,
      category: "Plantas antiguas",
      idAutor: 4,
      rating: 3,
      vecesJugada: 67,
      preguntas: [
        {
          pregunta: "¿Cuantas plantas antiguas hay?",
          correcta: "2",
          incorrectas: ["1", "3", "4"]   
        }
      ]
    }, 
    {
      id: 5,
      category: "idk bruh",
      idAutor: 5,
      rating: 3,
      vecesJugada: 67,
      preguntas: [
        {
          pregunta: "¿uh?",
          correcta: "your mom",
          incorrectas: ["uhhh", "ommmm", "bruh"]   
        }
      ]
    },
  ]
}