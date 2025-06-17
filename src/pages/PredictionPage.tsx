import { Calendar22 } from '../components/DatePicker';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';

export default function SettingsPage({role}) {
  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Predictions</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="p-6 bg-white shadow-sm rounded-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-800">Enter the nessarry details to for predicction</h2>
            <div className="space-y-4">
              <div className='flex flex-1 justify-between'>
              <div>
      <Label htmlFor="date" className="px-1">
Start Date      </Label>
                <Calendar22 />
              </div>
              <div>
                      <Label htmlFor="date" className="px-1">
End Date      </Label>
                <Calendar22 />
              </div>
              </div>
              <div>
      <Label htmlFor="prediction-span" className="px-1">
Span      </Label>
<input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="3"
                />              </div>
              <div>
                <Label htmlFor="prediction-type" className="px-1">
Preiod Type                </Label>
<input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Quarterly"
                />              </div>
            </div>
            <div className='flex justify-end'>
            <Button className='bg-gradient-to-r from-custom-blue to-custom-light-blue text-white mt-6'> Predict</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}