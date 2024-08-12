/* eslint-disable @typescript-eslint/no-explicit-any */
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../types/index";
import {
  account,
  appwriteConfig,
  avatars,
  databases,
  storage,
} from "./appWrite-config";
import { ID, ImageGravity, Query } from "appwrite";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(user.name);

    const newUser = await saveUserToDB({
      accountId: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      imageUrl: avatarUrl,
      username: user.username,
    });

    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function saveUserToDB(user: {
  accountId: string;
  name: string;
  email: string;
  imageUrl: URL;
  username?: string;
}) {
  try {
    const newUser = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailPasswordSession(
      user.email,
      user.password
    );
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const currentAcount = await account.get();

    if (!currentAcount) throw Error;

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAcount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log(error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
  }
}

export async function createPost(post: INewPost) {
  try {
    // first upload the image to storage
    const uploadedFile = await uploadFile(post.file[0]);

    if (!uploadedFile) throw Error;

    // get file URL
    const fileURL = getFilePreview(uploadedFile.$id);

    if (!fileURL) {
      // delete the file
      deleteFile(uploadedFile.$id);
      throw Error;
    }

    // handel the tags
    const tags = post.tags?.replace(/ /g, "").split(",");

    // save the post to DB
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileURL,
        imageId: uploadedFile.$id,
        location: post.location,
        tags: tags,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );

    return uploadedFile;
  } catch (error) {
    console.log(error);
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileURL = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      ImageGravity.Top,
      100
    );
    return fileURL;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getRecentPosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(20)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  const posts = await databases.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postsCollectionId,
    queries
  );
  if (!posts) throw Error;

  return posts;
}

export async function likePost(postId: string, likesArray: string[]) {
  try {
    const updatePost = await databases.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );

    if (!updatePost) throw Error;
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatePost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        post: postId,
        user: userId,
      }
    );

    if (!updatePost) throw Error;
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );

    if (!statusCode) throw Error;

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getPostById(postId: string) {
  try {
    const post = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return post;
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post?.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      // first upload the file to storage;

      const uploadedFile = await uploadFile(post.file[0]);

      if (!uploadedFile) throw Error;

      // get the filePreview

      const fileUrl = getFilePreview(uploadedFile.$id);

      if (!fileUrl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }

      // updating the new image
      image = { ...image, imageUrl: fileUrl, imageId: uploadedFile.$id };

      // handling the tags
      const tags = post?.tags?.replace(/ /g, "").split(",");

      // update the post data to DB

      const newPost = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.postsCollectionId,
        post.postId,
        {
          caption: post.caption,
          imageUrl: image.imageUrl,
          imageId: image.imageId,
          location: post.location,
          tags: tags,
        }
      );

      if (!newPost) {
        await deleteFile(image.imageId);
        throw Error;
      }

      return newPost;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  if (!postId || !imageId) throw Error;

  try {
    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      postId
    );

    return { status: "ok" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      queries
    );
    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPosts(searchTerm: string) {
  try {
    const posts = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postsCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;

    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function getUsers({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$createdAt"), Query.limit(9)];

  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }

  try {
    const users = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      queries
    );

    if (!users) throw Error;
    return users;
  } catch (error) {
    console.log(error);
  }
}

export async function getTopCreators() {
  try {
    const topCreators = databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.orderAsc("$createdAt"), Query.limit(8)]
    );

    if (!topCreators) throw Error;

    return topCreators;
  } catch (error) {
    console.log(error);
  }
}

export async function getUserProfile(userId: string) {
  try {
    const profileUser = await databases.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    if (!profileUser) throw Error;

    return profileUser;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasNewProfilePhoto = user?.file.length > 0;

  try {
    let image = {
      imageUrl: user.imageUrl,
    };

    if (hasNewProfilePhoto) {
      const uploadedPhoto = await uploadFile(user.file[0]);

      if (!uploadedPhoto) throw Error;

      const photoUrl = getFilePreview(uploadedPhoto.$id);

      if (!photoUrl) {
        deleteFile(uploadedPhoto.$id);
        throw Error;
      }

      image = { ...image, imageUrl: photoUrl };

      const newProfile = await databases.updateDocument(
        appwriteConfig.databaseId,
        appwriteConfig.userCollectionId,
        user.userId,
        {
          name: user.name,
          username: user.username,
          imageUrl: image.imageUrl,
          email: user.email,
          bio: user.bio,
        }
      );

      if (!newProfile) {
        deleteFile(uploadedPhoto.$id);
        throw Error;
      }

      return newProfile;
    }
  } catch (error) {
    console.log(error);
  }
}
