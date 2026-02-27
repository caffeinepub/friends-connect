import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Array "mo:core/Array";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
  };

  public type Friend = {
    username : Text;
    online : Bool;
  };

  public type Message = {
    sender : Principal;
    content : Text;
    timestamp : Int;
  };

  public type Conversation = {
    friendUsername : Text;
    messages : [Message];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userFriends = Map.empty<Principal, [Friend]>();
  let userConversations = Map.empty<Principal, [Conversation]>();

  // --- User Profile Functions ---

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    checkUserPermission(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    checkUserPermission(caller);
    userProfiles.add(caller, profile);
  };

  // --- Friends Management ---

  // Add a new friend
  public shared ({ caller }) func addFriend(username : Text) : async () {
    checkUserPermission(caller);
    if (username == "") {
      Runtime.trap("Username cannot be empty");
    };

    let newFriend : Friend = {
      username;
      online = false;
    };

    let existing : [Friend] = switch (userFriends.get(caller)) {
      case (?friends) { friends };
      case (null) { [] };
    };

    // Prevent duplicate friends
    for (f in existing.vals()) {
      if (Text.equal(f.username, username)) {
        Runtime.trap("Friend already added");
      };
    };

    let updated = existing.concat([newFriend]);
    userFriends.add(caller, updated);
  };

  // Remove an existing friend
  public shared ({ caller }) func removeFriend(friendName : Text) : async () {
    checkUserPermission(caller);

    let existing : [Friend] = switch (userFriends.get(caller)) {
      case (?friends) { friends };
      case (null) { [] };
    };

    let updated = existing.filter(func(f) { not Text.equal(f.username, friendName) });

    userFriends.add(caller, updated);
  };

  // Get all friends for the caller
  public query ({ caller }) func getFriendsList() : async [Friend] {
    checkUserPermission(caller);

    switch (userFriends.get(caller)) {
      case (?friends) { friends };
      case (null) { [] };
    };
  };

  // --- Messaging ---

  // Send a message to a friend (by username)
  public shared ({ caller }) func sendMessage(friendUsername : Text, messageContent : Text) : async () {
    checkUserPermission(caller);
    if (messageContent == "") {
      Runtime.trap("Message content cannot be empty");
    };

    let message : Message = {
      sender = caller;
      content = messageContent;
      timestamp = 0;
    };

    let existingConversations : [Conversation] = switch (userConversations.get(caller)) {
      case (?convs) { convs };
      case (null) { [] };
    };

    // Find if conversation with this friend already exists
    var found = false;
    let updated = existingConversations.map(func(conv) {
      if (Text.equal(conv.friendUsername, friendUsername)) {
        found := true;
        {
          friendUsername = conv.friendUsername;
          messages = conv.messages.concat([message]);
        };
      } else { conv };
    });

    let final : [Conversation] = if (found) {
      updated;
    } else {
      updated.concat([{
        friendUsername;
        messages = [message];
      }]);
    };

    userConversations.add(caller, final);
  };

  // Get messages with a specific friend (by username)
  public query ({ caller }) func getMessagesWithFriend(friendUsername : Text) : async [Message] {
    checkUserPermission(caller);

    switch (userConversations.get(caller)) {
      case (?convers) {
        for (conv in convers.vals()) {
          if (Text.equal(conv.friendUsername, friendUsername)) {
            return conv.messages;
          };
        };
        [];
      };
      case (null) { [] };
    };
  };

  // Helper to check user permission for specific actions
  func checkUserPermission(caller : Principal) : () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can perform this action");
    };
  };
};
