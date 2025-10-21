export async function getTutorbyId(id) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return tutors[id];
}