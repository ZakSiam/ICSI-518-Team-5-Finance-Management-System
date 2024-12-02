import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import AddExpenseCard from '../components/AddExpenseCard';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [totalOwed, setTotalOwed] = useState(0);
  const [totalOwe, setTotalOwe] = useState(0);
  const [friendsBalance, setFriendsBalance] = useState([]);
  const [expensesByFriend, setExpensesByFriend] = useState({});
  const [expandedFriend, setExpandedFriend] = useState(null);
  const [showAddExpenseCard, setShowAddExpenseCard] = useState(false);
  const [viewAsChart, setViewAsChart] = useState(false);
  const [expandedBalance, setExpandedBalance] = useState(false);
  const [expandedOwe, setExpandedOwe] = useState(false);
//comments
  useEffect(() => {
    const fetchExpensesAndFriends = async () => {
      if (!user) return;

      const expensesRef = collection(db, 'expenses');
      const snapshot = await getDocs(expensesRef);

      let totalOwedAmount = 0;
      let totalOweAmount = 0;
      const balanceByFriend = {};
      const expensesGroupedByFriend = {};

      snapshot.forEach((doc) => {
        const expense = doc.data();
        const { createdBy, payers } = expense;

        payers.forEach((payer) => {
          if (payer.userId === user.uid && !payer.settled) {
            if (createdBy !== user.uid) {
              totalOweAmount += payer.share;
              balanceByFriend[createdBy] = (balanceByFriend[createdBy] || 0) - payer.share;

              if (!expensesGroupedByFriend[createdBy]) {
                expensesGroupedByFriend[createdBy] = [];
              }
              expensesGroupedByFriend[createdBy].push({
                description: expense.description,
                amount: payer.share,
                type: 'owe',
              });
            }
          } else if (createdBy === user.uid && payer.userId !== user.uid && !payer.settled) {
            totalOwedAmount += payer.share;
            balanceByFriend[payer.userId] = (balanceByFriend[payer.userId] || 0) + payer.share;

            if (!expensesGroupedByFriend[payer.userId]) {
              expensesGroupedByFriend[payer.userId] = [];
            }
            expensesGroupedByFriend[payer.userId].push({
              description: expense.description,
              amount: payer.share,
              type: 'owed',
            });
          }
        });
      });

      setTotalOwed(totalOwedAmount);
      setTotalOwe(totalOweAmount);

      const friendIds = Object.keys(balanceByFriend);
      if (friendIds.length > 0) {
        const friendsRef = collection(db, 'users');
        const friendsSnapshot = await getDocs(query(friendsRef, where('userId', 'in', friendIds)));

        const balanceList = friendsSnapshot.docs.map(doc => {
          const friendData = doc.data();
          return {
            friendId: friendData.userId,
            friendName: friendData.displayName,
            balance: balanceByFriend[friendData.userId],
          };
        });

        setFriendsBalance(balanceList.filter(friend => friend.balance !== 0));
      } else {
        setFriendsBalance([]);
      }

      setExpensesByFriend(expensesGroupedByFriend);
      setLoading(false);
    };

    fetchExpensesAndFriends();
  }, [user]);

  const handleSaveExpense = () => {
    setShowAddExpenseCard(false);
  };

  const toggleFriendDetails = (friendId) => {
    setExpandedFriend(prev => prev === friendId ? null : friendId);
  };

  const toggleOweDetails = () => {
    setExpandedOwe(prev => !prev);
  };

  if (loading) return <div>Loading...</div>;

  const yourBalance = totalOwed - totalOwe;
  const hasActiveBalances = friendsBalance.length > 0;

  const chartData = {
    labels: [...friendsBalance.map((friend) => friend.friendName), 'You'],
    datasets: [
      {
        label: 'Balance ($)',
        data: [...friendsBalance.map((friend) => friend.balance), yourBalance],
        backgroundColor: [
          ...friendsBalance.map((friend) =>
            friend.balance > 0 ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)'
          ),
          'rgba(59, 130, 246, 0.6)',
        ],
        borderColor: [
          ...friendsBalance.map((friend) =>
            friend.balance > 0 ? 'rgba(34, 197, 94, 1)' : 'rgba(239, 68, 68, 1)'
          ),
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Balances Overview',
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-white">Dashboard</h2>

      <div className="flex justify-end">
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md my-6"
          onClick={() => setShowAddExpenseCard(true)}
        >
          Add Expense
        </button>
      </div>

      {showAddExpenseCard && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <AddExpenseCard
            friends={[]}
            groups={[]}
            onSave={handleSaveExpense}
            onClose={() => setShowAddExpenseCard(false)}
          />
        </div>
      )}

      <div className="flex gap-4 mb-8">
        <div className="bg-green-100 p-4 rounded shadow w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-green-600">Total Owed to You</h3>
          <p className="text-2xl">${hasActiveBalances ? totalOwed.toFixed(2) : '0.00'}</p>
        </div>
        <div className="bg-red-100 p-4 rounded shadow w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-red-600">Total You Owe</h3>
          <p className="text-2xl">${hasActiveBalances ? totalOwe.toFixed(2) : '0.00'}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded shadow w-full md:w-1/3">
          <h3 className="text-xl font-semibold text-blue-600">Total Balance</h3>
          <p className="text-2xl">${hasActiveBalances ? yourBalance.toFixed(2) : '0.00'}</p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
          onClick={() => setViewAsChart(!viewAsChart)}
        >
          {viewAsChart ? 'View as List' : 'View as Chart'}
        </button>
      </div>

      {viewAsChart ? (
        <div className="bg-white p-4 rounded shadow">
          {hasActiveBalances ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div className="text-center py-8 text-gray-600">
              No active balances to display
            </div>
          )}
        </div>
      ) : (
        <div>
          <div>
            <h3 className="text-xl font-semibold mb-4 text-white">You are Owed</h3>
            <div className="bg-white shadow rounded-lg p-4">
              {hasActiveBalances ? (
                <ul className="space-y-4">
                  {friendsBalance.map((friend) => (
                    <li key={friend.friendId} className="flex flex-col justify-between items-start">
                      <div className="flex justify-between items-center w-full">
                        <span className="font-medium">{friend.friendName}</span>
                        <span className={`font-semibold ${friend.balance > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ${friend.balance.toFixed(2)}
                        </span>
                        <button
                          onClick={() => toggleFriendDetails(friend.friendId)}
                          className="ml-4 text-blue-600"
                        >
                          {expandedFriend === friend.friendId ? 'Hide Details' : 'View Details'}
                        </button>
                      </div>

                      {expandedFriend === friend.friendId && (
                        <div className="mt-2 pl-4 space-y-2 w-full">
                          {expensesByFriend[friend.friendId]?.map((expense, index) => (
                            <div key={index} className="flex justify-between">
                              <span className="flex-1 text-left">{expense.description}</span>
                              <span className={`text-right ${expense.type === 'owe' ? 'text-red-600' : 'text-green-600'}`}>
                                ${expense.amount.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-gray-600">
                  Everyone is settled up! 🎉
                </div>
              )}
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-white">You Owe</h3>
            <div className="bg-white shadow rounded-lg p-4">
              {hasActiveBalances ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Amount I Owe</span>
                    <span className="font-semibold text-red-600">
                      ${totalOwe.toFixed(2)}
                    </span>
                    <button
                      className="ml-4 text-blue-600"
                      onClick={toggleOweDetails}
                    >
                      {expandedOwe ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                  
                  {expandedOwe && (
                    <div className="mt-4 space-y-2">
                      {Object.entries(expensesByFriend).map(([friendId, expenses]) => (
                        expenses.map((expense, index) => (
                          expense.type === 'owe' && (
                            <div key={`${friendId}-${index}`} className="flex justify-between">
                              <span>{expense.description}</span>
                              <span className="text-red-600">
                                ${expense.amount.toFixed(2)}
                              </span>
                            </div>
                          )
                        ))
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-600">
                 You don't owe anything!🎉
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
