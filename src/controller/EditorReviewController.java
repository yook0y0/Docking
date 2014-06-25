package controller;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import controller.action.AddAction;
import controller.action.DeleteAction;
import controller.action.ModifyAction;
import controller.action.SearchAction;

import util.Injector;
import view.DeveloperReview;
import vo.EditorReviewVO;
import vo.EditorVO;
import vo.MemberVO;

public class EditorReviewController {

	private HttpServletRequest req;
	private HttpServletResponse res;

	public void setRequest(HttpServletRequest req){
		this.req = req;
	}

	public void setResponse(HttpServletResponse res){
		this.res = res;
	}

	public void editorReviewAdd() 
	{
		// TODO Auto-generated method stub
		long time = System.currentTimeMillis(); 
		Date	date = new Date(time);
		
		String editor = req.getParameter("editor");
		String score = req.getParameter("score");
		String review = req.getParameter("review");
		
		MemberVO member = (MemberVO)req.getSession().getAttribute("logInMember");
		
		String writer = member.getId();
		
		EditorReviewVO ervo = new EditorReviewVO();
		
		ervo.setReviewId(String.valueOf(time));
		ervo.setEditor(editor);
		ervo.setWriter(writer);
		ervo.setReview(review);
		ervo.setScore(Integer.valueOf(score));
		ervo.setWrittenDate(date);
		
		AddAction addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
		
		addAction.addEditorReview(ervo);
	}

	public void editorReviewModify() throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		long time = System.currentTimeMillis(); 
		Date	date = new Date(time);
		
		String reviewId = req.getParameter("reviewId");
		String editor = req.getParameter("editor");
		String writer = req.getParameter("writer");
		String review = req.getParameter("review");
		String score = req.getParameter("score");
		
		EditorReviewVO ervo = new EditorReviewVO();
		
		ervo.setReviewId(reviewId);
		ervo.setEditor(editor);
		ervo.setWriter(writer);
		ervo.setReview(review);
		ervo.setScore(Integer.valueOf(score));
		ervo.setWrittenDate(date);
		
		ModifyAction modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
		modifyAction.modifyEditorReview(ervo);
		
		req.setAttribute("ervo", ervo);
		req.getRequestDispatcher("./boardUpdate.jsp").forward(req, res);
	}

	public void editorReviewSearch()	throws ServletException, IOException 
	{
		String 	editorName = req.getParameter("editorName");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		List<EditorReviewVO>	editorReviewList = searchAction.searchEditorReviewByEditorName(editorName);
		
		req.setAttribute("editorReviewList", editorReviewList);
		req.getRequestDispatcher("./reviewEditorName.jsp").forward(req, res);
	}

	public void editorReviewSearchAll() throws ServletException, IOException 
	{
		String	writer = req.getParameter("writer");
		
		SearchAction searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
		
		List<EditorReviewVO> ervoList = searchAction.searchEditorReviewByWriter(writer);	
		List<String>	editorNameList = new ArrayList<String>();
		
		for(EditorVO vo : searchAction.searchEditorList(writer))
		{
			editorNameList.add(vo.getName());
		}
		
		double	score[] = new double[editorNameList.size()];
		int	tempScore;
		int cnt;
		
		List<DeveloperReview>	developerReviewList = new ArrayList<DeveloperReview>();
		DeveloperReview	dr[] = new DeveloperReview[editorNameList.size()];
		
		for(int i = 0 ; i < editorNameList.size() ; i++)
		{
			cnt = 0;
			tempScore = 0;
			dr[i] = new DeveloperReview();
			
			for(int j = 0 ; j < ervoList.size() ; j++)
			{
				if(editorNameList.get(i).equals(ervoList.get(j).getEditor()))
				{
					tempScore += ervoList.get(j).getScore();
					
					cnt++;
				}
			}
			
			if(cnt != 0)
			{
				score[i] = tempScore / cnt;
				
				dr[i].setEditorName(editorNameList.get(i));
				dr[i].setEditorType(searchAction.searchEditor(editorNameList.get(i)).getEditorType());
				dr[i].setTotalScore(score[i]);
				
				developerReviewList.add(dr[i]);
			}
		}
		
		req.setAttribute("developerReviewList", developerReviewList);
		req.getRequestDispatcher("./reviewList.jsp").forward(req, res);
	}

	public void editorReviewDelete() throws ServletException, IOException {
		// TODO Auto-generated method stub

		String reviewId = req.getParameter("reviewId");
		
		DeleteAction deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
		deleteAction.deleteEditorReview(reviewId);
		
		req.getRequestDispatcher("./start.jsp").forward(req,res);
	}
	
	public void editorReviewUpdateView() throws ServletException, IOException {
		// TODO Auto-generated method stub

		String reviewId = req.getParameter("reviewId");
		String editor = req.getParameter("editor");
		String writer = req.getParameter("writer");
		String review = req.getParameter("review");
		String score = req.getParameter("score");
		
		long time = System.currentTimeMillis(); 
		Date	date = new Date(time);
		
		EditorReviewVO ervo = new EditorReviewVO();
		ervo.setReviewId(reviewId);
		ervo.setEditor(editor);
		ervo.setWriter(writer);
		ervo.setReview(review);
		ervo.setScore(Integer.valueOf(score));
		ervo.setWrittenDate(date);
		
		req.setAttribute("ervo", ervo);
		req.getRequestDispatcher("./boardUpdate.jsp").forward(req, res);
	}
}
