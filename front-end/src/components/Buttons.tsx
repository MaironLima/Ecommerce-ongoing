import { useNavigate } from "react-router-dom"

function Buttons() {
  const navigate = useNavigate()

  function login () {
    navigate("/auth/login")
  }
  function register () {
    navigate("/auth/register")
  }
  function recover () {
    navigate("/auth/recover-password")
  }

  return (
    <div  className="flex mt-20 gap-5">  
      <button onClick={login}>Login</button>
      <button onClick={register}>Register</button>
      <button onClick={recover}>Recover</button>
    </div>
  )
}

export default Buttons