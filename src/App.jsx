import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import './App.css'

function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [usernameInput, setUsernameInput] = useState('G')
  const [pinInput, setPinInput] = useState('')
  const [currentUser, setCurrentUser] = useState('')

  // App State
  const [transactions, setTransactions] = useState([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchTransactions()
    }
  }, [isAuthenticated])

  async function fetchTransactions() {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: true })
    
    if (data) setTransactions(data)
    if (error) console.error("Error fetching:", error)
  }

  const handleLogin = (e) => {
    e.preventDefault();
    if ((usernameInput === 'G' || usernameInput === 'T') && pinInput === '1426') {
      setCurrentUser(usernameInput);
      setIsAuthenticated(true);
    } else {
      alert("Invalid Username or PIN!");
    }
  }

  const handleTransaction = async (type) => {
    if (!description || !amount) return alert("Please enter both description and amount!")

    const newTransaction = {
      description: description,
      amount: parseFloat(amount),
      type: type,
      user_id: currentUser
    }

    const { error } = await supabase
      .from('transactions')
      .insert([newTransaction])

    if (!error) {
      setDescription('')
      setAmount('')
      fetchTransactions()
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="login-container">
        <div className="login-card">
          <div className="heart-icon">🩶</div>
          <h2>Welcome Back</h2>
          <p className="love-quote">"Building our future, one step at a time."</p>
          <form onSubmit={handleLogin}>
            <select 
              value={usernameInput} 
              onChange={(e) => setUsernameInput(e.target.value)}
              className="login-input"
            >
              <option value="G">Gokul Raj (G)</option>
              <option value="T">Thivya Rani (T)</option>
            </select>
            <input 
              type="password" 
              placeholder="Enter PIN" 
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              className="login-input"
            />
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    )
  }

  let balanceG = 0;
  let balanceT = 0;

  transactions.forEach((tx) => {
    const val = Number(tx.amount);
    if (tx.user_id === 'G') {
      tx.type === 'income' ? (balanceG += val) : (balanceG -= val);
    } else if (tx.user_id === 'T') {
      tx.type === 'income' ? (balanceT += val) : (balanceT -= val);
    }
  })

  return (
    <div className="app-container">
      <header className="glass-header">
        <div className="balances">
          <div className="bal-pill g-pill">
            <span className="user-label">Gokul Raj</span>
            <span className="amt">₹{balanceG}</span>
          </div>
          <div className="bal-pill t-pill">
            <span className="user-label">Thivya Rani</span>
            <span className="amt">₹{balanceT}</span>
          </div>
        </div>
      </header>

      <main className="chat-window">
         <div className="chat-background-quote">
            "Growing together, investing in us." 🩶
         </div>
        {transactions.map((tx) => {
          const isMe = tx.user_id === currentUser;
          return (
            <div key={tx.id} className={`message-wrapper ${isMe ? 'sent' : 'received'}`}>
              <div className={`message-bubble ${isMe ? 'my-bubble' : 'their-bubble'}`}>
                <div className="tx-header">
                  <span className="tx-desc">{tx.description}</span>
                  <span className={`tx-type-icon ${tx.type === 'income' ? 'icon-plus' : 'icon-minus'}`}>
                    {tx.type === 'income' ? '▲' : '▼'}
                  </span>
                </div>
                <p className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'} ₹{tx.amount}
                </p>
              </div>
            </div>
          )
        })}
      </main>

      <footer className="glass-footer">
        <div className="input-row">
          <input 
            type="text" 
            placeholder="What was this for?" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="glass-input desc-input"
          />
          <input 
            type="number" 
            placeholder="₹" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="glass-input amt-input"
          />
        </div>
        <div className="action-buttons">
          <button onClick={() => handleTransaction('income')} className="btn btn-income">Add Income</button>
          <button onClick={() => handleTransaction('outcome')} className="btn btn-outcome">Add Expense</button>
        </div>
      </footer>
    </div>
  )
}

export default App