import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import FormulaInput from './components/FormulaInput';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const [fieldNames, setFieldNames] = useState({ field1: '', field2: '', field3: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldNames((prevNames) => ({
      ...prevNames,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="App">
        <h1>Formula Input Example</h1>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="input-form">
            {[1, 2, 3].map((index) => (
              <label key={index}>
                Field {index} Name:
                <input
                  type="text"
                  name={`field${index}`}
                  value={fieldNames[`field${index}`]}
                  onChange={handleInputChange}
                />
              </label>
            ))}
            <button type="submit">Submit</button>
          </form>
        ) : (
          <>
            <div className="formula-input-row">
              {[1, 2, 3].map((index) => (
                <FormulaInput key={index} name={fieldNames[`field${index}`]} />
              ))}
            </div>
          </>
        )}
      </div>
    </QueryClientProvider>
  );
}

export default App;