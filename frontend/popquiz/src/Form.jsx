import { useId, useEffect, useState } from 'react';

//So I asked CoPilot with some help on making sure I got my FastAPI working and apparently it was all wrong,
//and then it changed a whole bunch of stuff. So I'm just gonna be real, I wrote barely any of the code for the
//FastAPI portion.

export default function Form() {
  const Id = useId();
  const ccInputId = useId();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    cc: '',
    expiration: '',
    security: '',
    ssn: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:8000/submit-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const data = await response.json();
      setSuccess(`Form submitted successfully! ID: ${data.id}`);
      
      // Reset form
      setFormData({
        name: '',
        age: '',
        cc: '',
        expiration: '',
        security: '',
        ssn: ''
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  
  };

  // so I defintely wrote most the stuff below

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/*name*/}
        <label>
          Your name:
          <input name="name" value={formData.name} onChange={handleChange} />
        </label>
        <hr />
        {/*age*/}
        <label htmlFor={Id + "age"}>Your age:</label>
        <input id={Id + "age"} name="age" type="number" value={formData.age} onChange={handleChange} />
        <hr />
        {/*credit card number*/}
        <label htmlFor={Id + 'creditcard'}>Your Credit Card Number:</label>
        <input id={Id + 'creditcard'} name="cc" type="number" value={formData.cc} onChange={handleChange} />
        <hr />
        {/*expiration*/}
        <label htmlFor={Id + 'exp'}>Expiration Date:</label>
        <input id={Id + 'exp'} name="expiration" type="number" value={formData.expiration} onChange={handleChange} />
        <hr />
        {/*security code*/}
        <label htmlFor={Id + 'sec'}>The whacky numbers on the back of the credit card:</label>
        <input id={Id + 'sec'} name="security" type="number" value={formData.security} onChange={handleChange} />
        <hr />
        {/*ssn*/}
        <label htmlFor={Id + 'ssn'}>Your Social Security Number (just in case of course):</label>
        <input id={Id + 'ssn'} name="ssn" type="number" value={formData.ssn} onChange={handleChange} />
        <hr />
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Info'}
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </>
  );
}

// template for form pulled from React website: https://react.dev/reference/react-dom/components/input
// 
