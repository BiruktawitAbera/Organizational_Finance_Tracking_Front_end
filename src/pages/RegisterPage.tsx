import { Button } from "../components/ui/button";

function SignUpPage() {
  return (
    <main className="flex w-full min-h-screen">
      <section className="relative flex items-center justify-center flex-1 p-2 overflow-hidden bg-white">
        <div className="w-full max-w-md px-6 pt-2 mx-auto bg-white rounded-lg shadow-md animate-fadeIn">
          <div className="flex items-center mb-4">
            <div className="p-2 rounded-full">
              <img src="/logo.png" alt="HorizonLogo" width={33} height={33} />
            </div>
            <h1 className="font-serif text-3xl font-bold">BudgetWise</h1>
          </div>
          <h1 className="text-3xl font-semibold py-2.5">Register</h1>
          <p className="mb-10 text-sm font-normal text-gray-400 gray-100">Welcome! Please Enter these details to register.</p>
          <form>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Email</label>
              <input type="email" placeholder="Enter your email address.." className="w-full px-3 py-2 border rounded" required />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input type="password" placeholder="Password" className="w-full px-3 py-2 border rounded" minLength={6} required/>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Departmant</label>
              <select className="w-full px-3 py-2 border rounded" required>
                <option value="dept1">Dept 1</option>
                <option value="dept2">Dept 2</option>
                <option value="dept3">Dept 3</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Role</label>
              <select className="w-full px-3 py-2 border rounded" required>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">salary</label>
              <input type="numbers" className="w-full px-3 py-2 border rounded" placeholder="salary" maxLength={5} required />
            </div>
            <Button className="relative w-full bg-sky-600 hover:bg-sky-700 group">
              Register
              <span className="absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100">→</span>
            </Button>
          </form>
          <div className="flex items-center my-7">
            <hr className="flex-grow" />
            <span className="mx-2 text-gray-400">or</span>
            <hr className="flex-grow" />
          </div>
          <div className="text-center">
            <p className="my-6 text-sm text-gray-500">
              Already have an account? <a href="/login" className="font-semibold text-sky-600">Sign in</a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default SignUpPage;
