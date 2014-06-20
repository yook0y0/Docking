package controller.action;

import java.io.IOException;
import java.io.Reader;
import java.util.List;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

import com.ibatis.common.resources.Resources;

import service.GenericService;
import serviceImpl.GenericServiceImpl;
import vo.DocumentVO;
import vo.EditorCodeVO;
import vo.EditorReviewVO;
import vo.EditorVO;
import vo.MemberContentsVO;
import vo.MemberVO;
import vo.TempVO;

public class SearchAction {
	
	public DocumentVO searchDocument(String id)
	{
		GenericService<DocumentVO>	s = new GenericServiceImpl<DocumentVO>();
		return s.search("document_search", id);
	}
	
	public EditorCodeVO searchEditorCode(String id)
	{
		GenericService<EditorCodeVO>	s = new GenericServiceImpl<EditorCodeVO>();
		return s.search("editorCode_search", id);
	}

	public EditorVO searchEditor(String id)
	{
		GenericService<EditorVO>	s = new GenericServiceImpl<EditorVO>();
		return s.search("editor_search", id);
	}
	
	public EditorReviewVO searchEditorReview(String id)
	{
		GenericService<EditorReviewVO>	s = new GenericServiceImpl<EditorReviewVO>();
		return s.search("editor_search", id);
	}

	public MemberVO searchMember(String id)
	{
		GenericService<MemberVO>	s = new GenericServiceImpl<MemberVO>();
		return s.search("member_search", id);
	}

	public MemberContentsVO searchMemberContents(String id)
	{
		GenericService<MemberContentsVO>	s = new GenericServiceImpl<MemberContentsVO>();
		return s.search("memberContents_search", id);
	}

	public TempVO searchTemp(String id)
	{
		GenericService<TempVO>	s = new GenericServiceImpl<TempVO>();
		return s.search("temp_search", id);
	}

	public List<EditorVO> searchAllEditor()
	{
		GenericService<EditorVO>s = new GenericServiceImpl<EditorVO>();
		return s.searchAll("editor_searchAll");
	}

	public List<MemberVO> searchAllMember()
	{
		GenericService<MemberVO>s = new GenericServiceImpl<MemberVO>();
		return s.searchAll("member_searchAll");
	}

	public List<MemberContentsVO> searchAllMemberContents(){
		GenericService<MemberContentsVO>s = new GenericServiceImpl<MemberContentsVO>();
		return s.searchAll("member_searchAll");
	}

	public List<TempVO> searchAllTemp(){
		GenericService<TempVO>s = new GenericServiceImpl<TempVO>();
		return s.searchAll("temp_searchAll");
	}
	
	public List<MemberContentsVO>	searchMemberContentsList(String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
		List<MemberContentsVO>	list = sqlSession.selectList("memberContents_search", id);
		
		sqlSession.close();
		
		return list;
	}
	
	public List<DocumentVO>	searchDocumentList(String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
		List<DocumentVO>	list = sqlSession.selectList("document_searchAll", id);
		
		sqlSession.close();
		
		return list;
	}
	
	public List<EditorCodeVO>	searchEditorCodeList(String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
		List<EditorCodeVO>	list = sqlSession.selectList("editorCode_searchAll", id);
		
		sqlSession.close();
		
		return list;
	}
	
	public List<EditorVO>	searchEditorList(String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
		List<EditorVO>	list = sqlSession.selectList("editor_searchAll", id);
		
		sqlSession.close();
		
		return list;
	}
	
	public List<EditorReviewVO>	searchEditorReviewList(String id)	throws RuntimeException
	{
		String resource = "mybatis-config.xml";
		Reader reader = null;
		SqlSession	sqlSession = null;
		SqlSessionFactory	sqlMapper = null;
		
		try 
		{
			reader = Resources.getResourceAsReader(resource);

			sqlMapper = new SqlSessionFactoryBuilder().build(reader);
			
			sqlSession = sqlMapper.openSession();
		} 
		
		catch (IOException e) 
		{
			e.printStackTrace();
		}
		
		List<EditorReviewVO>	list = sqlSession.selectList("editorReview_searchAll", id);
		
		sqlSession.close();
		
		return list;
	}
}
