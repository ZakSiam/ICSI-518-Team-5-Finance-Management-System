import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { createData } from "../services/firestoreService";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { collection, getDoc, doc, getDocs, query, where } from "firebase/firestore";

export default function Groups() {
  const [user] = useAuthState(auth);
  const [groups, setGroups] = useState([]);
  const [friends, setFriends] = useState([]); // Holds only the user's friends
  const [showAddForm, setShowAddForm] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [formGroup, setFormGroup] = useState({
    groupName: "",
    description: "",
    members: [],
    memberIds:[]
  });

  useEffect(() => {
    if (user) {
      const loadGroupsAndFriends = async () => {
        // Fetch groups where the user is a member
        const groupData = await fetchUserGroups();
        setGroups(groupData);

        // Fetch friends of the current user
        const friendsData = await fetchUserFriends();
        setFriends(friendsData);
        setLoading(false);
      };

      loadGroupsAndFriends();
    }
  }, [user]);

  // Fetch groups where the user is a member
  const fetchUserGroups = async () => {
    const groupsRef = collection(db, "groups");
    const q = query(groupsRef, where("memberIds", "array-contains", user.uid));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch friends of the current user
  const fetchUserFriends = async () => {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const userData = userDoc.data();
      setUserName(userData.displayName);
      return userData.friends.map(friend => ({
        id: friend.friendId,
        displayName: friend.friendName,
      }));
    }
    return [];
  };

  const handleShowAddForm = () => setShowAddForm(!showAddForm);

  const handleGroupChange = (e) => {
    const { name, value } = e.target;
    setFormGroup(prev => ({ ...prev, [name]: value }));
  };

  const handleMemberSelection = (e) => {
    const selectedFriendId = e.target.value;
    const selectedFriend = friends.find(friend => friend.id === selectedFriendId);
    if (selectedFriend && !formGroup.members.some(member => member.id === selectedFriendId)) {
      setFormGroup(prev => ({
        ...prev,
        members: [...prev.members, { id: selectedFriendId, name: selectedFriend.displayName }],
        memberIds: [...prev.memberIds, selectedFriendId]
      }));
    }
  };

  const removeMember = (memberId) => {
    setFormGroup(prev => ({
      ...prev,
      members: prev.members.filter(member => member.id !== memberId),
    }));
  };

  const handleAddGroup = async () => {
    
    const updatedFormGroup = {
      ...formGroup,
      members: [...formGroup.members, { id: user.uid, name: userName }],
      memberIds: [...formGroup.memberIds, user.uid],
    };
   
    setFormGroup(updatedFormGroup);

    await createData("groups", updatedFormGroup, user.uid);

    setGroups([...groups, updatedFormGroup]);

    setFormGroup({ groupName: "", description: "", members: [] });
    setShowAddForm(false);
};


  
