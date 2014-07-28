package kr.co.docking.controller;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import kr.co.docking.action.AddAction;
import kr.co.docking.action.DeleteAction;
import kr.co.docking.action.ModifyAction;
import kr.co.docking.action.SearchAction;
import kr.co.docking.util.Injector;
import kr.co.docking.vo.EditorReviewBBSVO;

public class ReviewController
{
   private HttpServletRequest req;
   private HttpServletResponse res;
   
   public void setReq(HttpServletRequest req) 
   {
      this.req = req;
   }
   
   public void setRes(HttpServletResponse res) 
   {
      this.res = res;
   }
   
   public void editorReviewBBSCreate() throws IOException 
   {
      SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ( "yyyy.MM.dd HH:mm:ss", Locale.KOREA );
      
      EditorReviewBBSVO   ervo = new EditorReviewBBSVO();
      ervo.setReviewId(req.getParameter("reviewId"));
      ervo.setEditorId(req.getParameter("editorId"));
      ervo.setMemberId(req.getParameter("memberId"));
      ervo.setBody(req.getParameter("body"));
      ervo.setScore(Integer.valueOf(req.getParameter("score")));
      ervo.setWrittenDate(mSimpleDateFormat.format(new Date()));
      
      AddAction   addAction = (AddAction)Injector.getInstance().getObject(AddAction.class);
      addAction.editorReviewBBSAdd(ervo);
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSCreate");
      writer.flush();
   }
   
   public void editorReviewBBSUpdate() throws IOException 
   {
      SimpleDateFormat    mSimpleDateFormat = new SimpleDateFormat ("yyyy.MM.dd HH:mm:ss", Locale.KOREA );
      
      EditorReviewBBSVO   ervo = new EditorReviewBBSVO();
      ervo.setReviewId(req.getParameter("reviewId"));
      ervo.setEditorId(req.getParameter("editorId"));
      ervo.setMemberId(req.getParameter("memberId"));
      ervo.setBody(req.getParameter("body"));
      ervo.setScore(Integer.valueOf(req.getParameter("score")));
      ervo.setWrittenDate(mSimpleDateFormat.format (new Date()));
      
      ModifyAction   modifyAction = (ModifyAction)Injector.getInstance().getObject(ModifyAction.class);
      modifyAction.editorReviewBBSModify(ervo);
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSUpdate");
      writer.flush();
   }
   
   public void editorReviewBBSRead() throws IOException 
   {
      String   reviewId = req.getParameter("reviewId");
      
      SearchAction   searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
      searchAction.editorReviewBBSSearch(reviewId);
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSRead");
      writer.flush();
   }
   
   public void editorReviewBBSReadAll() throws IOException 
   {
      SearchAction   searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
      searchAction.editorReviewBBSSearchAll();
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSReadAll");
      writer.flush();
   }
   
   public void editorReviewBBSReadAllByEditorId() throws IOException 
   {
      String   editorId = req.getParameter("editorId");
      
      SearchAction   searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
      searchAction.editorReviewBBSSearchByEditorId(editorId);
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSReadAllByEditorId");
      writer.flush();
   }
   
   public void editorReviewBBSReadAllByMemberId() throws IOException 
   {
      String   memberId = req.getParameter("memberId");
      
      SearchAction   searchAction = (SearchAction)Injector.getInstance().getObject(SearchAction.class);
      searchAction.editorReviewBBSSearchByEditorId(memberId);
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSReadAllByEditorId");
      writer.flush();
   }
   
   public void editorReviewBBSDelete() throws IOException 
   {
      String   reviewId = req.getParameter("reviewId");
      
      DeleteAction   deleteAction = (DeleteAction)Injector.getInstance().getObject(DeleteAction.class);
      deleteAction.editorReviewBBSDelete(reviewId);   
      
      PrintWriter writer = res.getWriter();

      writer.write("editorReviewBBSDelete");
      writer.flush();
   }
   
   public void editorReviewBBSDeleteAll() 
   {
      
   }
   
   public void orderByReview() 
   {
   
   }
}