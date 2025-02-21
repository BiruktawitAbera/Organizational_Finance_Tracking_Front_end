import { Button } from "../components/ui/button";
import { useState } from "react";

function SignUpPage() {
  const [loading, setLoading] = useState(false); // Loader state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('dept1');
  const [role, setRole] = useState('admin');
  const [salary, setSalary] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true); // Start loading

    // Simulate an API call with a timeout
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Registration logic
    console.log({ email, password, department, role, salary });

    setLoading(false); // Stop loading
  };

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
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Email</label>
              <input
                type="email"
                placeholder="Enter your email address.."
                className="w-full px-3 py-2 border rounded"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Password</label>
              <input
                type="password"
                placeholder="Password"
                className="w-full px-3 py-2 border rounded"
                minLength={6}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Department</label>
              <select
                className="w-full px-3 py-2 border rounded"
                required
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="dept1">Dept 1</option>
                <option value="dept2">Dept 2</option>
                <option value="dept3">Dept 3</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Role</label>
              <select
                className="w-full px-3 py-2 border rounded"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </select>
            </div>
            <div className="mb-2.5">
              <label className="block font-semibold text-base text-gray-500 mb-2.5">Salary</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded"
                placeholder="Salary"
                maxLength={5}
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              />
            </div>

            <Button type="submit" className={`relative w-full bg-sky-600 hover:bg-sky-700 group ${loading ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={loading}>
              Register
              <span className={`absolute transition-opacity transition-transform duration-300 ease-out transform translate-x-4 opacity-0 right-4 group-hover:translate-x-0 group-hover:opacity-100`}>→</span>
            </Button>
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-white bg-opacity-50">
                <div className="loader"></div> 
              </div>
            )}
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
