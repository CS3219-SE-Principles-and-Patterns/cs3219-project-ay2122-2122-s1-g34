// import { Box, Button, Grid, Typography, useTheme } from "@mui/material";

// import { useAppSelector } from "common/hooks/use-redux.hook";
// import getInitials from "common/utils/get-initials.util";

// dummy
// TODO: Replace dummy data
// const userName = "John Tan";
// const ranking = 3;

export default function LeaderboardUserSection() {
  // const themePalette = useTheme().palette;

  // const pastAttempts = useAppSelector(selectPastAttempts);

  return null;
  // return (
  //   <Grid
  //     item
  //     xs={4}
  //     sx={{
  //       display: "flex",
  //       flexDirection: "column",
  //       justifyContent: "space-between",
  //       flexGrow: 1,
  //       paddingBottom: 4,
  //     }}
  //   >
  //     <Box
  //       sx={{
  //         display: "flex",
  //         flexDirection: "column",
  //         borderRadius: 3,
  //         borderWidth: 3,
  //         borderStyle: "solid",
  //         width: "100%",
  //         height: "70vh",
  //         alignItems: "center",
  //         justifyContent: "space-between",
  //         boxShadow: `-4px 4px 3px ${themePalette["violet"].main}`,
  //         padding: 6,
  //         paddingBottom: 4,
  //       }}
  //       borderColor={"violet.main"}
  //     >
  //       <Box
  //         sx={{
  //           display: "flex",
  //           flexDirection: "column",
  //           width: "100%",
  //           alignItems: "center",
  //         }}
  //       >
  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "center",
  //             borderRadius: 30,
  //             borderColor: "blue.main",
  //             borderStyle: "solid",
  //             height: 80,
  //             width: 80,
  //             borderWidth: 4,
  //           }}
  //         >
  //           <Typography fontWeight={"500"} variant="h3">
  //             {getInitials(userName)}
  //           </Typography>
  //         </Box>

  //         <Typography fontWeight={"500"} variant="h6" sx={{ marginBottom: 3 }}>
  //           You
  //         </Typography>

  //         <Box
  //           sx={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             width: "100%",
  //           }}
  //         >
  //           <Typography>
  //             <Typography
  //               component="span"
  //               variant="h4"
  //               sx={{ display: "block" }}
  //               fontWeight={"500"}
  //             >
  //               {ranking}
  //             </Typography>
  //             <Typography component="span" variant="h5" fontWeight={"500"}>
  //               Ranking
  //             </Typography>
  //           </Typography>

  //           <Typography>
  //             <Typography
  //               component="span"
  //               variant="h4"
  //               sx={{ display: "block" }}
  //               fontWeight={"500"}
  //             >
  //               {pastAttempts.totalPoints}
  //             </Typography>
  //             <Typography component="span" variant="h5" fontWeight={"500"}>
  //               Points
  //             </Typography>
  //           </Typography>
  //         </Box>

  //         <Box
  //           sx={{
  //             display: "flex",
  //             flexDirection: "column",
  //             width: "100%",
  //             mt: 4,
  //           }}
  //         >
  //           <Typography variant="h6" fontWeight="600" sx={{ mb: 2 }}>
  //             Questions done
  //           </Typography>
  //           <Box
  //             sx={{
  //               display: "flex",
  //               alignItems: "center",
  //               justifyContent: "space-between",
  //               width: "100%",
  //             }}
  //           >
  //             <Typography>
  //               <Typography component="span" variant="h6" fontWeight="500">
  //                 Easy
  //               </Typography>

  //               <Typography
  //                 component="span"
  //                 variant="h5"
  //                 sx={{ display: "block", color: "green.main" }}
  //                 fontWeight="600"
  //               >
  //                 {pastAttempts.easyQuestionsDone}
  //               </Typography>
  //             </Typography>

  //             <Typography>
  //               <Typography component="span" variant="h6" fontWeight="500">
  //                 Medium
  //               </Typography>

  //               <Typography
  //                 component="span"
  //                 variant="h5"
  //                 sx={{ display: "block", color: "yellow.main" }}
  //                 fontWeight="600"
  //               >
  //                 {pastAttempts.mediumQuestionsDone}
  //               </Typography>
  //             </Typography>

  //             <Typography>
  //               <Typography component="span" variant="h6" fontWeight="500">
  //                 Hard
  //               </Typography>

  //               <Typography
  //                 component="span"
  //                 variant="h5"
  //                 sx={{ display: "block", color: "red.main" }}
  //                 fontWeight="600"
  //               >
  //                 {pastAttempts.hardQuestionsDone}
  //               </Typography>
  //             </Typography>
  //           </Box>
  //         </Box>
  //       </Box>

  //       <Button
  //         variant="contained"
  //         sx={{ textTransform: "none", borderRadius: 20, fontSize: 18 }}
  //       >
  //         Review questions
  //       </Button>
  //     </Box>
  //   </Grid>
  // );
}
