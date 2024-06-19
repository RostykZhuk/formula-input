import React, { useState } from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import { useQuery } from 'react-query';
import './FormulaInput.css';

const KeyCodes = {
  comma: 188,
  enter: 13
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const isOperator = (tag) => {
  return ['+', '-', '*', '/', '(', ')', '^', '%', '=', '>', '<', '>=', '<=', '!='].includes(tag);
};

const fetchAutocompleteSuggestions = async () => {
  const response = await fetch('https://652f91320b8d8ddac0b2b62b.mockapi.io/autocomplete');
  const data = await response.json();
  return data.map(suggestion => ({ id: String(suggestion.id), text: suggestion.name }));
};

const FormulaInput = ({ name }) => {
  const [tags, setTags] = useState([]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);

  const { data: suggestions, isLoading, isError } = useQuery('autocomplete', fetchAutocompleteSuggestions);

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleTagUpdate = (i, newTag) => {
    const newTags = tags.map((tag, index) => (index === i ? newTag : tag));
    setTags(newTags);
  };

  const handleCalculate = () => {
    const expression = tags.map(tag => tag.text).join(' ');
    try {
      setResult(eval(expression));
    } catch (error) {
      setResult('Error');
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching suggestions</div>;

  return (
    <div className="formula-input-container">
      <label>{name}</label>
      <ReactTags
        tags={tags}
        suggestions={suggestions || []}
        handleDelete={handleDelete}
        handleAddition={handleAddition}
        delimiters={delimiters}
        autofocus={false}
        placeholder="Add a tag"
        tagComponent={({ tag, classNames }) => (
          <span
            className={`${classNames.tag} ${isOperator(tag.text) ? 'operator-tag' : ''}`}
          >
            {tag.text}
          </span>
        )}
      />
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        onBlur={() => {
          if (input) {
            handleAddition({ id: input, text: input });
            setInput('');
          }
        }}
      />
      <button onClick={handleCalculate}>Calculate</button>
      {result !== null && <div className="result">Result: {result}</div>}
    </div>
  );
};

export default FormulaInput;